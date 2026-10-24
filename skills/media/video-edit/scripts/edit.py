#!/usr/bin/env python3
"""video-edit：一批素材剪成一条成片。只依赖标准库和 ffmpeg、ffprobe，台词另需 whisper-cli。

  edit.py init <素材目录> --lang ja|zh|en|…|none [--whisper-model P] [--vad-model P]
  edit.py analyze [--clip ID …] [--threshold T] [--stems] [--force]
                                                           事实层 -> clips.json，补 log.json 骨架。--stems 分离人声和伴奏
  edit.py sheet <clip|视频> --start S --dur D [--fps 4]      局部逐帧触点图
  edit.py sheet <clip|视频> --at T                           单帧大图
  edit.py schema [log|edl]                                   日志和 EDL 的字段
  edit.py check                                              逐层检查 -> check.json、edl.md
  edit.py inspect                                            给挨着选段边缘、只粗看过的崩坏出 6fps 局部图
  edit.py gaps                                               edl.json 的缺镜头 -> reshoots.md 补拍单和参考帧
  edit.py render [--force]                                   edl.json -> cuts/vN.mp4、vN.json、成片触点图

工作区默认 <素材目录>/.video-edit/。不传 --work 时从当前目录向上找 project.json。
init 可以重跑：重新扫描素材目录，没传的设置保持原样。
"""
import argparse, array, glob, hashlib, json, math, os, re, shutil, statistics, subprocess, sys

VIDEO_EXT = (".mp4", ".mov", ".mkv", ".m4v", ".webm")
SHEET_BUDGET = 1600       # 触点图长宽上限（像素）。Read 读更大的图会缩小，细节丢失
SCENE_MIN_GAP = 0.30      # 相邻切点候选的最小间隔
ENV_STEP, SILENCE_DB, SILENCE_MIN = 0.1, -50.0, 0.3
SLIVER = 0.25             # 选段边缘带进另一个镜头不足这么长，就是残帧
LINE_TAIL = 0.10          # 出点至少在句尾之后这么多
COARSE_FPS, COARSE_NEAR = 4, 1.0   # 低于 4fps 看过的崩坏，选段边缘离它不到 1 秒就要复看
BLACK_FRAMES = 2           # 选段里含黑场达到这么多帧就算问题；有意的黑场停顿用 black 色帧
HANDLE = 0.06             # 硬切处声音交叉淡化 = 2 × HANDLE，以剪点为中心
REF_LUFS, GAIN_CAP = -23.0, 12.0   # 每个声音放置先归到同一响度，增益上限 ±12 dB，混完再整体归一
SOUNDS = ("mix", "voice", "bed", "none")   # 选段取哪路声音：原声、人声、伴奏、静音
# 人声分离命令，{in} 是输入 wav，{out} 是输出目录，要在里面写出 voice.wav 和 bed.wav。project.json 的 separator 可覆盖
SEPARATOR = ["audio-separator", "{in}", "-m", "model_bs_roformer_ep_317_sdr_12.9755.ckpt", "--output_format", "WAV",
             "--output_dir", "{out}", "--model_file_dir", "~/.cache/audio-separator",
             "--custom_output_names", '{"Vocals": "voice", "Instrumental": "bed"}']
SEAM_JUMP = 10.0          # 剪点前后 0.3 秒响度差超过这么多 dB，进听片清单。实测全片相邻窗自然起伏 p90 约 9 dB
EPS = 1e-6

KINDS = {
    "body":     "形体：脸融化或被拉长、五官粘连，多出或拉长的手指肢体，人、动物、道具粘在一起",
    "motion":   "运动：拖影、重影，脸和头发被糊成一团",
    "text":     "文字：屏幕、纸面、招牌上的字镜像、乱码、逐帧跳变",
    "identity": "漂移：同一镜头里衣服、发型、脸、道具变了",
    "exposure": "曝光：一团白或近全黑，看不清主体",
    "physics":  "物理：悬空、穿模、不合重力",
    "nudity":   "裸露或衣着不雅。不能豁免",
}
SEVERITY = ("major", "minor")
WAIVABLE = ("defect", "black", "line", "sliver", "coarse")
EDL_KEYS = {"scenes", "unused", "sound", "audio", "fade_in", "fade_out", "lufs"}
SCENE_KEYS = {"id", "beat", "dissolve", "selects"}
SELECT_KEYS = {"clip", "in", "out", "why", "flip", "speed", "waive", "color", "frames", "gap", "dur",
               "sound", "lead", "lag", "gain"}
LAYER_KEYS = {"file", "from", "to", "offset", "in", "gain", "fade", "duck", "why"}
SHOT_KEYS = {"t0", "t1", "what", "framing", "text", "side"}
DEFECT_KEYS = {"t0", "t1", "kind", "severity", "seen", "note"}

SCHEMA = {"log": """log.json：看片日志。analyze 按切点候选生成骨架，看图之后由你填写和修正。

{"clips": {"<clip>": {
  "summary": "这条素材讲了什么，一句话",
  "shots": [{"t0": 0.0, "t1": 2.75, "what": "床头闹钟特写，红色数字",
             "framing": "特写", "text": "08:47", "side": "A 左 B 右"}],
  "defects": [{"t0": 16.0, "t1": 18.0, "kind": "motion", "severity": "major",
               "seen": 4, "note": "起身时睡衣拖影，带出多余肢体"}]}}}

shots    首尾相接，盖满 0 到素材时长。切点候选漏了就拆开，误检就合并。
         what 必填。framing 景别机位，text 画面上的字，side 主体在画面的左右，选填。
         有两个以上主体或有方向运动的镜头填 side，查越轴靠它。
defects  t0 写到看得见问题的最早一帧。seen 是看这段用的抽帧密度（fps），缺省 1。
         只在 1fps 图上看到的，区间前后各放 0.5 秒。
         severity：major 选段必须避开；minor 可以用，check 只记一笔。
         kind 取值：
""" + "\n".join(f"           {k:<9}{v}" for k, v in KINDS.items()),
"edl": """edl.json：剪辑决定，唯一的计划来源。

{"scenes": [
  {"id": "A", "beat": "她又睡过头了", "selects": [
    {"clip": "0", "in": 0.0, "out": 2.0, "why": "开场多停一拍"},
    {"clip": "5", "in": 10.4, "out": 17.6, "flip": true, "why": "水平翻转，和上一镜头同侧"},
    {"clip": "2", "in": 4.0, "out": 10.5, "speed": 1.25, "why": "压缩入画过程"},
    {"clip": "5", "in": 12.0, "out": 14.0, "lag": 0.6, "sound": "voice", "why": "画面先切到听者，话说完"},
    {"color": "white", "frames": 3, "why": "闪白，光爆接下一场"},
    {"gap": "近景，她把胶囊丢进嘴里，原地消失只剩睡衣落下", "dur": 1.5, "why": "素材里没有讲清胶囊作用的镜头"},
    {"clip": "3", "in": 17.0, "out": 17.5, "why": "拿起手机一瞬",
     "waive": {"coarse": "6fps 看过，17.5 前屏幕没亮"}}]},
  {"id": "B", "dissolve": 0.4, "beat": "…", "selects": ["…"]}],
 "unused": {"6": "3 的备选，鱼眼段脸部融化"},
 "sound": "voice",
 "audio": [{"file": "music/bgm.mp3", "from": "A", "to": "F", "gain": -14, "fade": 1.0, "duck": 8,
            "why": "全片一条 BGM 盖住各条素材自带的音乐"}],
 "fade_in": 0.3, "fade_out": 0.8, "lufs": -16}

scenes   一场一个拍点，按叙事顺序。beat 必填，观众在这一场必须得到的一件事，一句话。
         场内选段之间硬切。dissolve 是从上一场叠化进本场的秒数，缺省硬切。
selects  素材选段：clip、in、out（素材内的秒）、why 必填。flip 水平翻转，speed 倍速。
         色帧：color（white 或 black）加 frames，作闪白或黑场停顿。
         缺镜头：gap 写清要拍什么（景别、主体、动作），dur 是秒数。渲染成灰色占位，edit.py gaps 出补拍单。
         同一素材、同样 flip 和 speed，上一段 out 等于下一段 in，视为一个连续镜头。
         时长按整数帧：round((out - in) / speed × fps)。
声音     画面是主轨，每个选段自带同期声，其他声音是锚在画面上的声音层。
         sound 取哪路同期声：mix 原声（缺省）、voice 人声、bed 伴奏、none 静音。
         voice 和 bed 要先 edit.py analyze --stems。顶层 sound 是全片缺省，选段可以覆盖。
         lead 声音比画面早进的秒数（J-cut），lag 声音比画面晚出的秒数（L-cut）。gain 额外增益 dB。
         台词规则看声音的入出点（in - lead、out + lag），画面规则看画面的入出点。
audio    声音层，音乐和音效。file 相对工作区或绝对路径。from、to 是锚点：场 id，或选段如 "C#6"。
         从 from 的开头加 offset 秒起，到 to 的结尾止；没有 to 就到片尾或文件结束。
         in 是从文件第几秒开始取。gain dB，fade 两头淡入淡出秒数（缺省 0.5），duck 有台词时压低的 dB。
         所有声音先归到同一响度再叠加，gain 是相对这个基准的增减。音乐垫底常用 -12 到 -18。
waive    {规则: 原因}，明知违反还要用。可豁免：""" + " ".join(WAIVABLE) + """。
unused   没用上的素材和原因。每条素材要么在选段里，要么在这里。
fade_in fade_out lufs  片头片尾淡入淡出秒数、目标响度，缺省 0.3、0.8、-16。
"""}

# ---------- 基础 ----------

def die(msg):
    sys.exit(f"错误：{msg}")

def run(cmd, binary=False):
    r = subprocess.run(cmd, capture_output=True, text=not binary)
    if r.returncode:
        err = r.stderr.decode(errors="replace") if binary else r.stderr
        die(f"命令失败：{' '.join(map(str, cmd))}\n{err[-800:]}")
    return r

def jload(path, default=None):
    if not os.path.exists(path):
        if default is not None:
            return default
        die(f"找不到 {path}")
    with open(path) as f:
        try:
            return json.load(f)
        except json.JSONDecodeError as e:
            die(f"{path} 不是合法 JSON：{e}")

def jdump(obj, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(obj, f, indent=1, ensure_ascii=False)

def sha1(path):
    with open(path, "rb") as f:
        return hashlib.sha1(f.read()).hexdigest()[:10]

def is_num(*xs):
    return all(isinstance(x, (int, float)) and not isinstance(x, bool) for x in xs)

def find_work(arg):
    if arg:
        return os.path.abspath(arg)
    d = os.getcwd()
    while True:
        for cand in (d, os.path.join(d, ".video-edit")):
            if os.path.exists(os.path.join(cand, "project.json")):
                return cand
        if os.path.dirname(d) == d:
            die("找不到工作区，先 edit.py init，或传 --work")
        d = os.path.dirname(d)

class Ws:
    """工作区。所有产物路径都从这里派生。"""
    def __init__(self, arg):
        self.dir = find_work(arg)
        self.project = jload(self.p("project.json"))
        self.ids = list(self.project["clips"])
        self.fps = self.project["target"]["fps"]
    def p(self, *parts):
        return os.path.join(self.dir, *parts)
    def src(self, cid):
        return os.path.join(self.project["src"], self.project["clips"][cid])
    def facts(self):
        return jload(self.p("clips.json"), {"clips": {}})["clips"]
    def log(self):
        return jload(self.p("log.json"), {"clips": {}})["clips"]

def probe(path):
    j = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path]).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    num, den = map(int, v["r_frame_rate"].split("/"))
    dur = float(j["format"]["duration"])
    return {"width": v["width"], "height": v["height"], "fps": round(num / den, 3),
            "frames": int(v.get("nb_frames") or round(dur * num / den)), "duration": round(dur, 3),
            "audio": {"sample_rate": int(a["sample_rate"]), "channels": a["channels"]} if a else None}

def frames_of(sel, fps):
    if "gap" in sel:
        return round(sel["dur"] * fps)
    if "color" in sel:
        return int(sel.get("frames") or 0)
    return round((sel["out"] - sel["in"]) / sel.get("speed", 1.0) * fps)

# ---------- 触点图 ----------

def grab(path, t, out, width, flip=False):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(t, 0):.3f}", "-i", path, "-frames:v", "1",
         "-vf", ("hflip," if flip else "") + f"scale={width}:-2", out])

def make_sheets(path, prefix, fps, w, h, start=0.0, dur=None, tile_w=None):
    """抽帧拼成网格，返回 (文件列表, 列, 行)。第 n 张第 k 格 = start + ((n-1)·列·行 + k) / fps 秒。"""
    tile_w = tile_w or (320 if w >= h else 200)
    cols, rows = SHEET_BUDGET // tile_w, max(1, SHEET_BUDGET // round(tile_w * h / w))
    os.makedirs(os.path.dirname(prefix), exist_ok=True)
    pattern = glob.escape(prefix) + "_[0-9][0-9].jpg"
    for old in glob.glob(pattern):
        os.remove(old)
    run(["ffmpeg", "-v", "error", "-y"] + (["-ss", f"{start:.3f}"] if start else []) +
        (["-t", f"{dur:.3f}"] if dur else []) +
        ["-i", path, "-vf", f"fps={fps},scale={tile_w}:-2,tile={cols}x{rows}", "-q:v", "3", prefix + "_%02d.jpg"])
    return sorted(glob.glob(pattern)), cols, rows

def grid_note(start, fps, cols, rows):
    return (f"每张 {cols} 列 {rows} 行。第 n 张第 k 格（行优先，从 0 数）"
            f"= {start:g} + ((n-1)×{cols * rows} + k) / {fps:g} 秒")

# ---------- init ----------

def clip_ids(stems):
    pre = os.path.commonprefix(stems)
    cut = max((pre.rfind(c) for c in "-_. "), default=-1) + 1
    ids = [s[cut:] for s in stems] if len(stems) > 1 else list(stems)
    return ids if all(ids) and len(set(ids)) == len(ids) else list(stems)

def pick_target(metas):
    """多数素材的画幅，短边不超过 1080。"""
    ratio = lambda m: round(m["width"] / m["height"], 2)
    same = [m for m in metas if ratio(m) == statistics.mode(ratio(m) for m in metas)]
    r = same[0]["width"] / same[0]["height"]
    short = min(1080, max(min(m["width"], m["height"]) for m in same))
    w, h = (short * r, short) if r >= 1 else (short, short / r)
    even = lambda x: int(round(x / 2) * 2)
    return {"width": even(w), "height": even(h), "fps": statistics.mode(round(m["fps"]) for m in metas)}

def cmd_init(a):
    src = os.path.abspath(a.src)
    files = sorted(f for f in os.listdir(src) if f.lower().endswith(VIDEO_EXT) and not f.startswith("."))
    if not files:
        die(f"{src} 里没有视频")
    work = os.path.abspath(a.work or os.path.join(src, ".video-edit"))
    old = jload(os.path.join(work, "project.json"), {})
    metas = {f: probe(os.path.join(src, f)) for f in files}
    proj = {"src": src, "work": work,
            "lang": a.lang or old.get("lang"),
            "target": old.get("target") or pick_target(list(metas.values())),
            "whisper_model": a.whisper_model or old.get("whisper_model") or os.environ.get("WHISPER_MODEL"),
            "vad_model": a.vad_model or old.get("vad_model") or os.environ.get("VAD_MODEL"),
            "clips": dict(zip(clip_ids([os.path.splitext(f)[0] for f in files]), files))}
    if not proj["lang"]:
        die("要 --lang：台词的语种（ja、zh、en…），没有台词传 none。不用 auto，无语音段会幻觉出台词")
    if proj["lang"] != "none":
        for k in ("whisper_model", "vad_model"):
            if not (proj[k] and os.path.exists(proj[k])):
                die(f"台词转写要 --{k.replace('_', '-')}（或环境变量 {k.upper()}），没有台词传 --lang none")
    jdump(proj, os.path.join(work, "project.json"))
    print(f"工作区 {work}")
    for cid, f in proj["clips"].items():
        m = metas[f]
        print(f"  {cid:>6}  {f}  {m['width']}x{m['height']} {m['fps']}fps {m['duration']}s 音频{'有' if m['audio'] else '无'}")
    T = proj["target"]
    print(f"目标 {T['width']}x{T['height']} {T['fps']}fps，台词语种 {proj['lang']}")

# ---------- analyze ----------

def scene_scores(path):
    out = run(["ffmpeg", "-v", "error", "-i", path, "-vf",
               "scale=320:-2,select='gte(scene,0)',metadata=print:file=-", "-an", "-f", "null", "-"]).stdout
    rows, t = [], None
    for line in out.splitlines():
        m = re.match(r"frame:\d+\s+pts:\d+\s+pts_time:([\d.]+)", line)
        if m:
            t = float(m.group(1))
        elif t is not None and (m := re.search(r"lavfi\.scene_score=([\d.]+)", line)):
            rows.append((t, float(m.group(1))))
    return rows

def pick_cuts(rows, fixed=None):
    """阈值按每条素材自己的分数基线自适应，相邻 0.3 秒内只留最高分。"""
    sc = sorted(s for _, s in rows) or [0.0]
    th = fixed or max(0.20, min(0.60, max(statistics.median(sc) * 25, sc[int(len(sc) * 0.99)] * 0.6)))
    cuts = []
    for t, s in rows:
        if s < th:
            continue
        if cuts and t - cuts[-1][0] < SCENE_MIN_GAP:
            if s > cuts[-1][1]:
                cuts[-1] = (t, s)
            continue
        cuts.append((t, s))
    return th, cuts

def detect_spans(path):
    err = run(["ffmpeg", "-hide_banner", "-i", path, "-vf", "blackdetect=d=0.2:pix_th=0.05,freezedetect=n=0.003:d=0.5",
               "-an", "-f", "null", "-"]).stderr
    black = [[round(float(a), 2), round(float(b), 2)] for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]
    st = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", err)]
    en = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", err)]
    return black, [[round(a, 2), round(b, 2)] for a, b in zip(st, en)]

def silences(path):
    s = decode16k(path)
    n = int(16000 * ENV_STEP)
    env = [20 * math.log10(math.sqrt(sum(x * x for x in s[i:i + n]) / n) + 1e-9) for i in range(0, len(s) - n + 1, n)]
    spans, start = [], None
    for i, d in enumerate(env + [0.0]):
        if d < SILENCE_DB and start is None:
            start = i
        elif d >= SILENCE_DB and start is not None:
            if (i - start) * ENV_STEP >= SILENCE_MIN:
                spans.append([round(start * ENV_STEP, 2), round(i * ENV_STEP, 2)])
            start = None
    return spans

def integrated_lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    m = re.findall(r"^\s+I:\s+(-?[\d.]+) LUFS", err, re.M)
    return float(m[-1]) if m else None

def transcribe(ws, cid):
    P = ws.project
    wav, base = ws.p("audio", f"{cid}.wav"), ws.p("speech", cid)
    os.makedirs(os.path.dirname(wav), exist_ok=True)
    os.makedirs(os.path.dirname(base), exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-i", ws.src(cid), "-vn", "-ac", "1", "-ar", "16000", wav])
    hint = ["--prompt", "以下是普通话的句子。"] if P["lang"].startswith("zh") else []   # 不加时默认出繁体
    run(["whisper-cli", "-m", P["whisper_model"], "-l", P["lang"], "--vad", "-vm", P["vad_model"],
         "-oj", "-of", base, "-f", wav] + hint)
    raw = jload(base + ".json")
    return [{"t0": s["offsets"]["from"] / 1000, "t1": s["offsets"]["to"] / 1000, "text": s["text"].strip()}
            for s in raw.get("transcription", []) if s["text"].strip()]

def analyze_clip(ws, cid, threshold):
    path = ws.src(cid)
    m = probe(path)
    th, cuts = pick_cuts(scene_scores(path), threshold)
    black, freeze = detect_spans(path)
    f = {"file": ws.project["clips"][cid], **m, "scene_threshold": round(th, 3),
         "cuts": [{"t": round(t, 3), "score": round(s, 3)} for t, s in cuts], "black": black, "freeze": freeze}
    if m["audio"]:
        f["audio"].update(lufs=integrated_lufs(path), silences=silences(path))
    files, cols, rows = make_sheets(path, ws.p("sheets", cid), 1, m["width"], m["height"])
    f["sheets"] = [os.path.relpath(x, ws.dir) for x in files]
    f["sheet_grid"] = [cols, rows]
    for name, t in (("first", 0), ("last", m["duration"] - 0.1)):
        grab(path, t, ws.p("frames", f"{cid}_{name}.jpg"), 960)
        f[name] = f"frames/{cid}_{name}.jpg"
    return f

def separate(ws, cid):
    """把素材音轨分成人声 voice 和伴奏 bed 两路，返回 facts 里的 stems。"""
    cmd = ws.project.get("separator") or SEPARATOR
    if not shutil.which(os.path.expanduser(cmd[0])):
        die(f"找不到人声分离工具 {cmd[0]}。装法：uv tool install --python 3.12 'audio-separator[cpu]'，"
            "或在 project.json 的 separator 里换成别的命令")
    wav, out = ws.p("audio", f"{cid}_full.wav"), ws.p("stems", cid)
    os.makedirs(os.path.dirname(wav), exist_ok=True)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    run(["ffmpeg", "-v", "error", "-y", "-i", ws.src(cid), "-vn", "-ac", "2", "-ar", "44100", wav])
    run([os.path.expanduser(x.replace("{in}", wav).replace("{out}", out)) for x in cmd])
    stems = {}
    for name in ("voice", "bed"):
        f = os.path.join(out, f"{name}.wav")
        if not os.path.exists(f):
            die(f"分离命令没写出 {f}，实际产出 {os.listdir(out)}")
        stems[name] = {"file": os.path.relpath(f, ws.dir), "lufs": integrated_lufs(f)}
    return stems

def seed_log(ws, facts):
    """没动过的日志条目按当前切点候选重建骨架，动过的保持原样。"""
    log = ws.log()
    for cid in ws.ids:
        f, e = facts.get(cid), log.get(cid)
        touched = e and (e.get("summary") or e.get("defects") or any(s.get("what") for s in e.get("shots", [])))
        if f and not touched:
            b = [0.0] + [c["t"] for c in f["cuts"]] + [f["duration"]]
            log[cid] = {"summary": "", "shots": [{"t0": b[i], "t1": b[i + 1], "what": ""} for i in range(len(b) - 1)],
                        "defects": []}
    jdump({"clips": log}, ws.p("log.json"))

def cmd_analyze(a):
    ws = Ws(a.work)
    facts = ws.facts()
    ids = a.clip or ws.ids
    if bad := [c for c in ids if c not in ws.project["clips"]]:
        die(f"未知素材 {bad}，可选 {ws.ids}")
    for cid in ids:
        old = facts.get(cid)
        if old is None or a.force or a.threshold is not None:
            new = analyze_clip(ws, cid, a.threshold)
            new["lines"] = None if old is None or a.force else old.get("lines")
            if old and not a.force and old.get("stems"):
                new["stems"] = old["stems"]
            facts[cid] = new
        f = facts[cid]
        if f["lines"] is None:
            f["lines"] = transcribe(ws, cid) if ws.project["lang"] != "none" and f["audio"] else []
        if a.stems and f["audio"] and (a.force or not f.get("stems")):
            f["stems"] = separate(ws, cid)
        texts = [l["text"] for l in f["lines"]]
        loop = [t for t in set(texts) if texts.count(t) >= 3]
        print(f"  {cid:>6} {f['duration']}s 切点 {[c['t'] for c in f['cuts']]} 台词 {len(f['lines'])} 句"
              + (f"  疑似转写幻觉：{loop}" if loop else "")
              + ("  人声 {voice[lufs]} / 伴奏 {bed[lufs]} LUFS".format(**f["stems"]) if f.get("stems") else ""))
        jdump({"clips": facts}, ws.p("clips.json"))
    seed_log(ws, facts)
    print(f"写入 {ws.p('clips.json')}，日志骨架 {ws.p('log.json')}")
    print("1fps 触点图在 clips.json 的 sheets，" + grid_note(0, 1, *next(iter(facts.values()))["sheet_grid"]))

# ---------- sheet ----------

def cmd_sheet(a):
    ws = Ws(a.work)
    if a.target in ws.project["clips"]:
        path, name = ws.src(a.target), a.target
    elif os.path.isfile(a.target):
        path, name = os.path.abspath(a.target), os.path.splitext(os.path.basename(a.target))[0]
    else:
        die(f"{a.target} 既不是素材 id 也不是文件")
    if a.at is not None:
        out = ws.p("sheets", "fine", f"{name}@{a.at:g}.jpg")
        grab(path, a.at, out, a.width or 1280)
        print(out)
        return
    if not a.dur:
        die("要 --dur（局部图）或 --at（单帧）")
    m = probe(path)
    files, cols, rows = make_sheets(path, ws.p("sheets", "fine", f"{name}_{a.start:g}+{a.dur:g}@{a.fps:g}"),
                                    a.fps, m["width"], m["height"], a.start, a.dur, a.width)
    print("\n".join(files))
    print(grid_note(a.start, a.fps, cols, rows))

# ---------- schema ----------

def cmd_schema(a):
    print("\n\n".join(SCHEMA[k] for k in ([a.which] if a.which else SCHEMA)))

# ---------- check ----------

def defect_issue(d, dur):
    if not isinstance(d, dict) or not is_num(d.get("t0"), d.get("t1")):
        return "缺 t0 或 t1"
    if extra := set(d) - DEFECT_KEYS:
        return f"未知字段 {sorted(extra)}"
    if not 0 <= d["t0"] < d["t1"] <= dur + 0.1:
        return f"区间 {d['t0']}-{d['t1']} 不在 0-{dur} 内"
    if d.get("kind") not in KINDS:
        return f"kind={d.get('kind')!r}，可选 {' '.join(KINDS)}"
    if d.get("severity") not in SEVERITY:
        return f"severity={d.get('severity')!r}，可选 major minor"
    if "seen" in d and not (is_num(d["seen"]) and d["seen"] > 0):
        return f"seen={d['seen']!r} 要是正数"
    return None

def log_issues(cid, e, f):
    if not e:
        return [f"{cid} 没有日志"]
    out = [f"{cid} 缺 summary"] if not e.get("summary") else []
    t = 0.0
    for i, s in enumerate(e.get("shots") or []):
        if not isinstance(s, dict) or not is_num(s.get("t0"), s.get("t1")):
            out.append(f"{cid} 镜头 {i} 缺 t0 或 t1")
            continue
        if extra := set(s) - SHOT_KEYS:
            out.append(f"{cid} 镜头 {i} 有未知字段 {sorted(extra)}")
        if abs(s["t0"] - t) > 0.05:
            out.append(f"{cid} 镜头 {i} 的 t0={s['t0']} 没接上前一镜头的 t1={t}")
        if not s.get("what"):
            out.append(f"{cid} 镜头 {i} [{s['t0']}-{s['t1']}] 缺 what")
        t = s["t1"]
    if abs(t - f["duration"]) > 0.1:
        out.append(f"{cid} 镜头只盖到 {t}，素材长 {f['duration']}")
    for d in e.get("defects") or []:
        if msg := defect_issue(d, f["duration"]):
            out.append(f"{cid} 崩坏 {d.get('t0')}-{d.get('t1') if isinstance(d, dict) else d}：{msg}")
    return out

def clean_range(t0, t1, avoid, lines, bounds, sp, fixed_head, fixed_tail, dur):
    """[t0, t1] 附近最长的干净区间：不压 avoid，边缘不在台词里，不带残帧。
    边缘落在台词里时，差 0.3 秒以内就外扩包住整句，否则收缩。"""
    clear = lambda x: 0 <= x <= dur and not any(a < x < b for a, b in avoid)
    for l in lines:
        if not fixed_head and l["t0"] + 0.05 < t0 < l["t1"] and t0 - l["t0"] <= 0.3 and clear(l["t0"]):
            t0 = l["t0"]
        if not fixed_tail and l["t0"] + 0.05 < t1 < l["t1"] + LINE_TAIL - EPS and l["t1"] + LINE_TAIL - t1 <= 0.3 \
                and clear(l["t1"] + LINE_TAIL):
            t1 = l["t1"] + LINE_TAIL
    segs = [(t0, t1)]
    for a, b in avoid:
        segs = [p for x, y in segs for p in ((x, min(y, a)), (max(x, b), y)) if p[1] > p[0]]
    best = None
    for x, y in segs:
        keep_x, keep_y = fixed_head and x == t0, fixed_tail and y == t1
        for _ in range(8):
            prev = (x, y)
            for l in lines:
                if not keep_x and l["t0"] + 0.05 < x < l["t1"]:
                    x = l["t1"]
                if not keep_y and l["t0"] + 0.05 < y < l["t1"] + LINE_TAIL - EPS:
                    y = l["t0"]
            for b in bounds:
                if not keep_x and x < b < y and (b - x) / sp < SLIVER:
                    x = b
                if not keep_y and x < b < y and (y - b) / sp < SLIVER:
                    y = b
            if (x, y) == prev:
                break
        if y - x >= 0.3 and (best is None or y - x > best[1] - best[0]):
            best = (x, y)
    return best

def sound_of(sel, edl):
    return sel.get("sound", edl.get("sound", "mix"))

def resolve(base, path):
    return path if os.path.isabs(path) else os.path.join(base, path)

def anchor_span(flat, name, fps):
    """锚点在成片里的 (起, 止)：场 id 取整场，'A#2' 取一个选段。"""
    its = [it for it in flat if it["at"] == name] or [it for it in flat if it["sid"] == name]
    return (its[0]["t"], its[-1]["t"] + its[-1]["frames"] / fps) if its else None

def check_edl(edl, facts, log, ids, fps, base="."):
    """返回 (问题, 备注, 选段表, 预计时长)。问题带 waived 的算已处理。"""
    found, notes, used_waives = [], [], set()

    def add(rule, at, msg, sel=None, **extra):
        why = (sel.get("waive") or {}).get(rule) if sel and rule in WAIVABLE else None
        if why:
            used_waives.add((id(sel), rule))
        found.append({"rule": rule, "at": at, "msg": msg, **({"waived": why} if why else {}), **extra})

    if not isinstance(edl, dict):
        add("format", "edl", "edl.json 顶层要是对象")
        return found, notes, [], 0.0
    for k in set(edl) - EDL_KEYS:
        add("format", "edl", f"未知字段 {k}")
    if edl.get("sound", "mix") not in SOUNDS:
        add("format", "edl", f"sound={edl['sound']!r}，可选 {' '.join(SOUNDS)}")
    flat = []
    for k, sc in enumerate(edl.get("scenes") or []):
        sid = str(sc.get("id", k))
        for key in set(sc) - SCENE_KEYS:
            add("format", sid, f"场里有未知字段 {key}")
        d = sc.get("dissolve")
        if d is not None and (k == 0 or not is_num(d) or d <= 0):
            add("format", sid, "dissolve 要是正数，且第一场没有可叠化的上一场")
            d = None
        if not sc.get("beat"):
            add("format", sid, "场没写 beat：观众在这一场必须得到的一件事")
        if not sc.get("selects"):
            add("format", sid, "场里没有 selects")
        for j, s in enumerate(sc.get("selects") or []):
            flat.append({"sid": sid, "j": j, "at": f"{sid}#{j}", "sel": s, "dissolve": d if j == 0 else None})
    if not flat:
        add("format", "edl", "没有任何选段")

    for it in flat:
        s, at = it["sel"], it["at"]
        it["ok"] = False
        if not isinstance(s, dict):
            add("format", at, "选段要是对象")
            continue
        for key in set(s) - SELECT_KEYS:
            add("format", at, f"未知字段 {key}")
        for key in set(s.get("waive") or {}) - set(WAIVABLE):
            add("format", at, f"waive 里的 {key} 不可豁免，可豁免：{' '.join(WAIVABLE)}")
        if not s.get("why"):
            add("why", at, "没写 why", s)
        if "gap" in s:
            if not s["gap"] or not (is_num(s.get("dur")) and s["dur"] > 0):
                add("format", at, "缺镜头要 gap 写清拍什么，dur 为正数秒")
            else:
                it["ok"] = True
                notes.append(f"{at} 缺镜头 {s['dur']}s：{s['gap']}。edit.py gaps 出补拍单")
            continue
        if "color" in s:
            if s["color"] not in ("white", "black") or not (isinstance(s.get("frames"), int) and s["frames"] > 0):
                add("format", at, "色帧要 color 为 white 或 black，frames 为正整数")
            else:
                it["ok"] = True
            continue
        cid, f = s.get("clip"), facts.get(s.get("clip"))
        t0, t1, sp = s.get("in"), s.get("out"), s.get("speed", 1.0)
        if cid not in ids or f is None:
            add("bounds", at, f"未知或没分析的素材 {cid!r}")
        elif not is_num(t0, t1, sp) or sp <= 0 or not 0 <= t0 < t1 <= f["duration"] + 0.01:
            add("bounds", at, f"{cid} 区间 {t0}-{t1} 不在 0-{f['duration']} 内，或 speed 不是正数")
        else:
            it["ok"] = True
            snd, lead, lag = sound_of(s, edl), s.get("lead", 0.0), s.get("lag", 0.0)
            if snd not in SOUNDS:
                add("format", at, f"sound={snd!r}，可选 {' '.join(SOUNDS)}")
            elif snd in ("voice", "bed") and f["audio"] and not (f.get("stems") or {}).get(snd):
                add("format", at, f"{cid} 还没有分离出 {snd} 声轨，先跑 edit.py analyze --stems")
            if not is_num(lead, lag, s.get("gain", 0.0)) or lead < 0 or lag < 0:
                add("format", at, "lead、lag 要是非负数，gain 要是数")
                it["ok"] = False
            elif t0 - lead * sp < -0.01 or t1 + lag * sp > f["duration"] + 0.01:
                add("bounds", at, f"{cid} 声音区间 {t0 - lead * sp:.2f}-{t1 + lag * sp:.2f} 超出素材 0-{f['duration']}")
                it["ok"] = False

    def joined(a, b):
        sa, sb = a["sel"], b["sel"]
        return (a["ok"] and b["ok"] and b["dissolve"] is None and "clip" in sa and "clip" in sb
                and sa["clip"] == sb["clip"] and abs(sa["out"] - sb["in"]) < 0.01
                and bool(sa.get("flip")) == bool(sb.get("flip")) and sa.get("speed", 1.0) == sb.get("speed", 1.0))

    for n, it in enumerate(flat):
        s, at = it["sel"], it["at"]
        if not it["ok"] or "clip" not in s:
            continue
        cid, t0, t1, sp = s["clip"], s["in"], s["out"], s.get("speed", 1.0)
        f, e = facts[cid], log.get(cid) or {}
        head = None if n > 0 and joined(flat[n - 1], it) else t0
        tail = None if n + 1 < len(flat) and joined(it, flat[n + 1]) else t1
        shots = [x for x in e.get("shots") or [] if isinstance(x, dict) and is_num(x.get("t0"))]
        bounds = [x["t0"] for x in shots[1:]] if shots else [c["t"] for c in f["cuts"]]
        lines = f.get("lines") or []
        defects = [d for d in e.get("defects") or [] if not defect_issue(d, f["duration"])]
        first = len(found)
        avoid = [(b0, b1) for b0, b1 in f.get("black", []) if min(t1, b1) - max(t0, b0) >= (BLACK_FRAMES - 0.5) / fps]
        for b0, b1 in avoid:
            add("black", at, f"{cid} {t0}-{t1} 含黑场 [{b0}-{b1}] {min(t1, b1) - max(t0, b0):.2f}s", s)
        lead, lag = s.get("lead", 0.0), s.get("lag", 0.0)
        a_head = None if head is None else round(t0 - lead * sp, 3)   # 声音的入出点
        a_tail = None if tail is None else round(t1 + lag * sp, 3)
        for l in lines if sound_of(s, edl) in ("mix", "voice") else []:
            span = f"「{l['text']}」[{l['t0']:.2f}-{l['t1']:.2f}]"
            if a_head is not None and l["t0"] + 0.05 < a_head < l["t1"]:
                add("line", at, f"{cid} 声音入点 {a_head} 切进台词{span}。整句包住要 in ≤ {l['t0']:.2f}，"
                    f"或 lead ≥ {(t0 - l['t0']) / sp:.2f}（J-cut）", s)
            if a_tail is not None and l["t0"] + 0.05 < a_tail < l["t1"] + LINE_TAIL - EPS:
                add("line", at, f"{cid} 声音出点 {a_tail} 切断台词{span}。整句包住要 out ≥ {l['t1'] + LINE_TAIL:.2f}，"
                    f"或 lag ≥ {(l['t1'] + LINE_TAIL - t1) / sp:.2f}（L-cut）", s)
        for b in bounds:
            if t0 < b < t1 and head is not None and (b - t0) / sp < SLIVER:
                add("sliver", at, f"{cid} 入点 {t0} 只带进镜头边界 {b} 之前 {b - t0:.2f}s 的残帧", s)
            if t0 < b < t1 and tail is not None and (t1 - b) / sp < SLIVER:
                add("sliver", at, f"{cid} 出点 {t1} 只带进镜头边界 {b} 之后 {t1 - b:.2f}s 的残帧", s)
        for d in defects:
            span = f"{d['kind']} [{d['t0']}-{d['t1']}]"
            if d["t0"] < t1 and d["t1"] > t0:
                if d["kind"] == "nudity":
                    add("nudity", at, f"{cid} {t0}-{t1} 压到 {span}，不能豁免")
                    avoid.append((d["t0"], d["t1"]))
                elif d["severity"] == "minor":
                    notes.append(f"{at} {cid} {t0}-{t1} 用到 minor 崩坏 {span}：{d.get('note', '')}")
                else:
                    add("defect", at, f"{cid} {t0}-{t1} 压到 {span}：{d.get('note', '')}", s)
                    avoid.append((d["t0"], d["t1"]))
            elif d["severity"] == "major" and d.get("seen", 1) < COARSE_FPS:
                if (head is not None and 0 <= head - d["t1"] < COARSE_NEAR) or \
                   (tail is not None and 0 <= d["t0"] - tail < COARSE_NEAR):
                    edge = head if head is not None and 0 <= head - d["t1"] < COARSE_NEAR else tail
                    look = [cid, round(max(0.0, min(edge, d["t0"]) - 0.5), 2),
                            round(min(f["duration"], max(edge, d["t1"]) + 0.5), 2)]
                    add("coarse", at, f"{cid} 边缘 {edge} 离只按 {d.get('seen', 1)}fps 看过的 {span} 不到 {COARSE_NEAR:g}s。"
                        f"edit.py inspect 出局部图，定准区间后把 seen 改成实际密度", s, look=look)
        mine = [x for x in found[first:] if x["rule"] in ("line", "sliver", "defect", "nudity", "black") and not x.get("waived")]
        if mine:
            r = clean_range(t0, t1, sorted(avoid), lines, bounds, sp, head is None, tail is None, f["duration"])
            fix = f"建议 in={math.ceil(r[0] * 100 - 1e-6) / 100} out={math.ceil(r[1] * 100 - 1e-6) / 100}" if r else "这段里没有干净的区间，换一段"
            for x in mine:
                x["fix"] = fix

    for n, it in enumerate(flat[:-1]):
        s, nx = it["sel"], flat[n + 1]["sel"]
        if it["ok"] and s.get("lag") and "clip" in nx and sound_of(nx, edl) != "none":
            notes.append(f"{it['at']} 的 L-cut 声音会叠在 {flat[n + 1]['at']} 的同期声上 {s['lag']}s，"
                         f"需要时把后者的 sound 改成 bed 或 none，或调低 gain")
        if it["ok"] and nx.get("lead") and "clip" in s and sound_of(s, edl) != "none":
            notes.append(f"{flat[n + 1]['at']} 的 J-cut 声音会叠在 {it['at']} 的同期声上 {nx['lead']}s")
    for n, it in enumerate(flat):
        d = it["dissolve"]
        if d and n > 0 and it["ok"] and flat[n - 1]["ok"]:
            a_, b_ = frames_of(flat[n - 1]["sel"], fps) / fps, frames_of(it["sel"], fps) / fps
            if 2 * d > min(a_, b_):
                add("dissolve", it["at"], f"叠化 {d}s 超过两侧选段（{a_:.2f}s、{b_:.2f}s）较短者的一半")

    used = {it["sel"].get("clip") for it in flat if isinstance(it["sel"], dict)}   # 引用了就算用了，越界另报
    unused = edl.get("unused") or {}
    for cid in ids:
        if cid in used and cid in unused:
            add("format", "unused", f"{cid} 用了又列在 unused")
        elif cid not in used and not unused.get(cid):
            add("unused", "unused", f"素材 {cid} 没用上，也没在 unused 写原因")

    for it in flat:
        s = it["sel"]
        for rule in (s.get("waive") or {}) if isinstance(s, dict) else {}:
            if rule in WAIVABLE and (id(s), rule) not in used_waives:
                notes.append(f"{it['at']} 的 waive.{rule} 没有对应的问题，可以删")

    t = 0.0
    for it in flat:
        t -= it["dissolve"] or 0.0
        it["t"], it["frames"] = round(t, 3), frames_of(it["sel"], fps) if it["ok"] else 0
        t += it["frames"] / fps

    for k, L in enumerate(edl.get("audio") or []):
        at = f"audio#{k}"
        if not isinstance(L, dict):
            add("format", at, "声音层要是对象")
            continue
        for key in set(L) - LAYER_KEYS:
            add("format", at, f"未知字段 {key}")
        if not L.get("why"):
            add("why", at, "没写 why")
        if not L.get("file") or not os.path.exists(resolve(base, L["file"])):
            add("format", at, f"找不到音频文件 {L.get('file')!r}（相对工作区 {base}）")
        spans = {key: anchor_span(flat, L[key], fps) for key in ("from", "to") if key in L}
        if "from" not in L:
            add("format", at, "缺 from 锚点")
        for key, sp_ in spans.items():
            if sp_ is None:
                add("format", at, f"{key}={L[key]!r} 不是场 id，也不是选段（如 C#6）")
        if spans.get("from") and spans.get("to") and spans["from"][0] + L.get("offset", 0.0) >= spans["to"][1]:
            add("format", at, "from 加 offset 晚于 to 的结尾")
        for key in ("offset", "in", "fade", "duck"):
            if key in L and not (is_num(L[key]) and L[key] >= 0):
                add("format", at, f"{key} 要是非负数")
        if "gain" in L and not is_num(L["gain"]):
            add("format", at, "gain 要是数")
    return found, notes, flat, round(t, 3)

def edl_md(edl, flat, total, fps, path):
    L = ["# EDL", "", f"由 edl.json 生成（edit.py check），只读。预计 {total:.1f} 秒。", ""]
    L += [f"- 未用 {k}：{v}" for k, v in (edl.get("unused") or {}).items()] + [""]
    scenes = {str(sc.get("id", k)): sc for k, sc in enumerate(edl.get("scenes") or [])}
    for sid, sc in scenes.items():
        rows = [it for it in flat if it["sid"] == sid]
        d = sc.get("dissolve")
        L += [f"## {sid}  {sc.get('beat', '')}", ""] + ([f"从上一场叠化 {d}s", ""] if d else [])
        L += ["| # | 成片 | 源 | 入 | 出 | 秒 | 选项 | why |", "|---|---|---|---|---|---|---|---|"]
        for it in rows:
            s = it["sel"] if isinstance(it["sel"], dict) else {}
            opt = " ".join(filter(None, ["flip" if s.get("flip") else "", f"x{s['speed']}" if s.get("speed") else "",
                                         f"声:{s['sound']}" if s.get("sound") else "",
                                         f"J{s['lead']}" if s.get("lead") else "", f"L{s['lag']}" if s.get("lag") else "",
                                         *[f"waive:{k}" for k in s.get("waive") or {}]]))
            src = f"缺镜头：{s['gap']}" if "gap" in s else f"{s['color']} 色帧" if "color" in s else s.get("clip")
            L.append(f"| {it['j']} | {it['t']:.2f} | {src} | {s.get('in', '')} | {s.get('out', '')} "
                     f"| {it['frames'] / fps:.2f} | {opt} | {s.get('why', '')} |")
        L.append("")
    if edl.get("audio"):
        L += ["## 声音层", "", "| # | 文件 | 从 | 到 | gain | duck | why |", "|---|---|---|---|---|---|---|"]
        L += [f"| {k} | {x.get('file')} | {x.get('from')} | {x.get('to', '片尾')} | {x.get('gain', 0)} | {x.get('duck', '')} "
              f"| {x.get('why', '')} |" for k, x in enumerate(edl["audio"]) if isinstance(x, dict)]
    with open(path, "w") as f:
        f.write("\n".join(L))

def latest_cut(ws):
    reps = glob.glob(ws.p("cuts", "v*.json"))
    return max(reps, key=lambda p: int(re.search(r"v(\d+)\.json$", p).group(1))) if reps else None

def cmd_check(a):
    ws = Ws(a.work)
    facts, log = ws.facts(), ws.log()
    stages = {}
    brief = ws.p("brief.md")
    stages["意图"] = ([] if os.path.exists(brief) and len(open(brief).read().strip()) > 40 else ["brief.md 没写"],
                     f"先问用户，再写 {brief}：意图、剧本、角色、故事")
    stages["事实"] = ([f"{c} 没分析" for c in ws.ids if c not in facts] +
                     [f"{c} 没转写台词" for c in ws.ids if c in facts and facts[c].get("lines") is None],
                     "edit.py analyze")
    issues = [x for c in ws.ids if c in facts for x in log_issues(c, log.get(c), facts[c])]
    stages["日志"] = (issues, "看 1fps 触点图，填 log.json（edit.py schema log）")
    found, notes, total = [], [], 0.0
    if not os.path.exists(ws.p("edl.json")):
        stages["剪辑"] = (["还没有 edl.json"], "写 edl.json（edit.py schema edl）")
    else:
        edl = jload(ws.p("edl.json"))
        found, notes, flat, total = check_edl(edl, facts, log, ws.ids, ws.fps, ws.dir)
        if isinstance(edl, dict):
            edl_md(edl, flat, total, ws.fps, ws.p("edl.md"))
        stages["剪辑"] = ([f"[{x['rule']}] {x['at']} {x['msg']}" + (f"  → {x['fix']}" if x.get("fix") else "")
                          for x in found if not x.get("waived")],
                         "edit.py inspect 细看边缘，改准 log.json" if any(x.get("look") and not x.get("waived") for x in found)
                         else "改 edl.json，或在选段 waive 里写明原因")
    rep = latest_cut(ws)
    if not rep:
        cut = (["还没渲染"], "edit.py render")
    elif not os.path.exists(ws.p("edl.json")) or jload(rep).get("edl_sha1") != sha1(ws.p("edl.json")):
        cut = ([f"{os.path.basename(rep)} 落后于当前 edl.json"], "edit.py render")
    else:
        cut = ([], f"成片 {jload(rep)['out']}，逐张看它的触点图")
    stages["成片"] = cut
    jdump({"stages": {k: v[0] for k, v in stages.items()}, "findings": found, "notes": notes, "duration": total},
          ws.p("check.json"))

    nxt = None
    for name, (rows, hint) in stages.items():
        waived = sum(1 for x in found if x.get("waived")) if name == "剪辑" else 0
        print(f"{name} " + ("✓" if not rows else f"✗ {len(rows)} 处") + (f"（{waived} 处已豁免）" if waived else ""))
        for r in rows:
            print(f"  - {r}")
        if rows and nxt is None:
            nxt = hint
    for n in notes:
        print(f"  备注 {n}")
    if total:
        print(f"预计时长 {total:.2f}s，EDL 视图 {ws.p('edl.md')}")
    print(f"下一步：{nxt or stages['成片'][1]}")
    sys.exit(1 if any(stages[k][0] for k in ("意图", "事实", "日志", "剪辑")) else 0)

# ---------- inspect ----------

def cmd_inspect(a):
    """给每个只按 1fps 看过、又挨着选段边缘的崩坏，出 6fps 局部图。"""
    ws = Ws(a.work)
    facts, log = ws.facts(), ws.log()
    found, _, _, _ = check_edl(jload(ws.p("edl.json")), facts, log, ws.ids, ws.fps, ws.dir)
    todo = {}
    for x in found:
        if x.get("look") and not x.get("waived"):
            todo.setdefault(tuple(x["look"]), []).append(x)
    if not todo:
        print("没有要细看的边缘")
        return
    for (cid, t0, t1), xs in todo.items():
        m = facts[cid]
        files, cols, rows = make_sheets(ws.src(cid), ws.p("sheets", "fine", f"{cid}_{t0:g}+{t1 - t0:g}@6"), 6,
                                        m["width"], m["height"], t0, t1 - t0)
        print("\n".join(f"[{x['at']}] {x['msg']}" for x in xs))
        print("\n".join(f"  {f}" for f in files) + f"\n  {grid_note(t0, 6, cols, rows)}")
    print("看完把 log.json 里这些崩坏的 t0、t1 改准，seen 改成 6，再跑 check")

# ---------- gaps ----------

def shot_at(log, cid, t):
    for s in (log.get(cid) or {}).get("shots") or []:
        if isinstance(s, dict) and is_num(s.get("t0"), s.get("t1")) and s["t0"] <= t < s["t1"] + 0.01:
            return "，".join(filter(None, [s.get("what"), s.get("framing"), s.get("side")]))
    return ""

def cmd_gaps(a):
    ws = Ws(a.work)
    facts, log, T = ws.facts(), ws.log(), ws.project["target"]
    edl = jload(ws.p("edl.json"))
    _, _, flat, _ = check_edl(edl, facts, log, ws.ids, ws.fps, ws.dir)
    gaps = [n for n, it in enumerate(flat) if it["ok"] and "gap" in it["sel"]]
    if not gaps:
        print("edl.json 里没有缺镜头")
        return
    out_dir = ws.p("reshoots")
    shutil.rmtree(out_dir, ignore_errors=True)
    beats = {str(sc.get("id", k)): sc.get("beat", "") for k, sc in enumerate(edl.get("scenes") or [])}
    real = lambda i: flat[i]["ok"] and "clip" in flat[i]["sel"]
    L = ["# 补拍单", "", "由 edl.json 的 gap 选段生成（edit.py gaps），只读。每条交给 video-prompt 写生成 prompt，"
         "角色外观见 brief.md。参考帧是成片里前后镜头的衔接帧，可作首尾帧参考。", ""]
    for n in gaps:
        it, s = flat[n], flat[n]["sel"]
        L += [f"## {it['at']}  成片 {it['t']:.2f}s", "", f"- 拍点：{beats.get(it['sid'], '')}", f"- 要拍：{s['gap']}",
              f"- 时长：{s['dur']}s，生成时两头各多留 1 秒余量", f"- 为什么缺：{s.get('why', '')}",
              f"- 画幅：{T['width']}x{T['height']}，{T['fps']}fps"]
        prev = next((flat[i] for i in range(n - 1, -1, -1) if real(i)), None)
        nxt = next((flat[i] for i in range(n + 1, len(flat)) if real(i)), None)
        for label, nb, side in (("前一镜头，接它的尾帧", prev, "prev"), ("后一镜头，接它的首帧", nxt, "next")):
            if not nb:
                continue
            ns = nb["sel"]
            t = ns["out"] - 1 / facts[ns["clip"]]["fps"] if side == "prev" else ns["in"]
            img = os.path.join(out_dir, f"{it['sid']}_{it['j']}_{side}.jpg")
            grab(ws.src(ns["clip"]), t, img, 1280, flip=ns.get("flip"))
            L.append(f"- {label}：{nb['at']}，素材 {ns['clip']} 的 {t:.2f}s" + ("，成片里水平翻转" if ns.get("flip") else "")
                     + f"。{shot_at(log, ns['clip'], t)}。参考帧 {img}")
        L.append("")
    with open(ws.p("reshoots.md"), "w") as f:
        f.write("\n".join(L))
    print(f"{len(gaps)} 处缺镜头 -> {ws.p('reshoots.md')}")

# ---------- render ----------

def seg_video(ws, sel, out, T):
    n = frames_of(sel, T["fps"])
    W, H, F = T["width"], T["height"], T["fps"]
    enc = ["-an", "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p", out]
    if "clip" not in sel:   # 色帧，或缺镜头的灰色占位
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c={sel.get('color', 'gray')}:s={W}x{H}:r={F}",
             "-frames:v", str(n)] + enc)
        return
    sp = sel.get("speed", 1.0)
    vf = (["hflip"] if sel.get("flip") else []) + ([f"setpts=PTS/{sp}"] if sp != 1.0 else []) + \
         [f"fps={F}", f"scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos",
          f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2", "setsar=1"]
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{sel['in']:.3f}", "-i", ws.src(sel["clip"]), "-vf", ",".join(vf),
         "-frames:v", str(n)] + enc)

def build_block(ws, k, sels, tmp, T):
    """一组硬切相连的选段，画面直接拼接。"""
    vs = []
    for i, sel in enumerate(sels):
        vs.append(f"{tmp}/b{k}v{i:02d}.mp4")
        seg_video(ws, sel, vs[-1], T)
    with open(f"{tmp}/b{k}.txt", "w") as f:
        f.write("".join(f"file '{v}'\n" for v in vs))
    vid = f"{tmp}/block{k}.mp4"
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/b{k}.txt", "-c", "copy", vid])
    return vid, sum(frames_of(x, T["fps"]) for x in sels) / T["fps"]

# ---------- 声音 ----------
# 所有声音都是「放置」：源文件的一段，放在成片的某个时刻，带淡入淡出和增益。混音就是把放置叠加。
# 硬切处的交叉淡化、叠化、J-cut 和 L-cut、垫底音乐，都只是放置的参数不同。

def norm_gain(lufs):
    return 0.0 if lufs is None or lufs < -60 else max(-GAIN_CAP, min(GAIN_CAP, REF_LUFS - lufs))

def sync_placements(ws, edl, flat, facts, fps):
    out = []
    for n, it in enumerate(flat):
        s = it["sel"]
        snd = sound_of(s, edl)
        if "clip" not in s or snd == "none" or not facts[s["clip"]]["audio"]:
            continue
        f, sp = facts[s["clip"]], s.get("speed", 1.0)
        nxt = flat[n + 1] if n + 1 < len(flat) else None
        hard_in, hard_out = n > 0 and not it["dissolve"], nxt is not None and not nxt["dissolve"]
        lead, lag = s.get("lead", 0.0), s.get("lag", 0.0)
        ext_in, ext_out = lead + (HANDLE if hard_in else 0.0), lag + (HANDLE if hard_out else 0.0)
        at, s0, s1 = it["t"] - ext_in, s["in"] - ext_in * sp, min(f["duration"], s["out"] + ext_out * sp)
        if s0 < 0 or at < 0:
            cut = max(-s0 / sp, -at)
            at, s0 = at + cut, s0 + cut * sp
        src, lufs = (ws.src(s["clip"]), f["audio"].get("lufs")) if snd == "mix" else \
                    (ws.p(f["stems"][snd]["file"]), f["stems"][snd]["lufs"])
        out.append({"label": it["at"], "src": src, "s0": s0, "s1": s1, "speed": sp, "at": at,
                    "fi": 2 * HANDLE if hard_in or lead else it["dissolve"] or 0.0,
                    "fo": 2 * HANDLE if hard_out or lag else (nxt or {}).get("dissolve") or 0.0,
                    "gain": norm_gain(lufs) + s.get("gain", 0.0)})
    return out

def audio_duration(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).stdout)

def layer_placements(ws, edl, flat, fps, total, speech):
    out = []
    for k, L in enumerate(edl.get("audio") or []):
        path = resolve(ws.dir, L["file"])
        start = anchor_span(flat, L["from"], fps)[0] + L.get("offset", 0.0)
        end = anchor_span(flat, L["to"], fps)[1] if "to" in L else total
        s0 = L.get("in", 0.0)
        s1 = min(s0 + end - start, audio_duration(path))
        fade = L.get("fade", 0.5)
        duck = [(a - start, b - start) for a, b in speech if b > start and a < start + s1 - s0] if L.get("duck") else []
        out.append({"label": f"audio#{k}", "src": path, "s0": s0, "s1": s1, "speed": 1.0, "at": start, "fi": fade,
                    "fo": fade, "gain": norm_gain(integrated_lufs(path)) + L.get("gain", 0.0),
                    "duck": (L.get("duck"), duck)})
    return out

def duck_expr(db, spans, ramp=0.15):
    """有台词的区间压低 db，两头各用 ramp 秒斜坡，免得听到台阶。"""
    g = 10 ** (-db / 20)
    terms = [f"clip((t-{a - ramp:.3f})/{ramp},0,1)*clip(({b + ramp:.3f}-t)/{ramp},0,1)" for a, b in spans]
    m = terms[0]
    for x in terms[1:]:
        m = f"max({m},{x})"
    return f"1-{1 - g:.4f}*{m}"

def render_sound(placements, total, fi, fo, tmp):
    files = []
    for i, p in enumerate(placements):
        length = (p["s1"] - p["s0"]) / p["speed"]
        if length <= 0.01:
            continue
        af = [f"atrim=start={p['s0']:.4f}:end={p['s1']:.4f}", "asetpts=PTS-STARTPTS"] + \
             ([f"atempo={p['speed']}"] if p["speed"] != 1.0 else []) + [f"volume={p['gain']:.2f}dB"]
        db, spans = p.get("duck") or (0, [])
        if db and spans:
            af.append(f"volume='{duck_expr(db, spans)}':eval=frame")
        af += ([f"afade=t=in:d={p['fi']:.4f}"] if p["fi"] else []) + \
              ([f"afade=t=out:st={max(0.0, length - p['fo']):.4f}:d={p['fo']:.4f}"] if p["fo"] else [])
        files.append((f"{tmp}/s{i:03d}.wav", p["at"]))
        run(["ffmpeg", "-v", "error", "-y", "-i", p["src"], "-vn", "-af", ",".join(af), "-ar", "48000", "-ac", "2", files[-1][0]])
    out = f"{tmp}/sound.wav"
    tail = f"apad=whole_dur={total:.4f},atrim=duration={total:.4f}" + \
           (f",afade=t=in:d={fi}" if fi else "") + (f",afade=t=out:st={total - fo:.4f}:d={fo}" if fo else "")
    if not files:
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", f"{total:.4f}", out])
        return out
    # 每路先补齐到全片长度再混。amix 遇到某一路提前结束时，输出会随线程调度时有时无地断掉
    fc = [f"[{i}:a]adelay={round(at * 1000)}:all=1,apad=whole_dur={total:.4f},atrim=duration={total:.4f}[p{i}]"
          for i, (_, at) in enumerate(files)]
    fc.append("".join(f"[p{i}]" for i in range(len(files))) +
              f"amix=inputs={len(files)}:normalize=0:duration=first,{tail}[ao]")
    run(["ffmpeg", "-v", "error", "-y"] + [x for f, _ in files for x in ("-i", f)] +
        ["-filter_complex", ";".join(fc), "-map", "[ao]", "-c:a", "pcm_s16le", out])
    verify_mix(out, files, fi, fo, total)
    return out

def verify_mix(mix, files, fi, fo, total):
    """每路声音在混音里的能量不该比它自己低 20 dB 以上。叠加只会加能量，掉了就是混音坏了。"""
    m, lost = decode16k(mix), []
    for f, at in files:
        own = decode16k(f)
        dur = len(own) / 16000
        a, b = max(at, fi), min(at + dur, total - fo)   # 片头片尾的淡入淡出本来就压低，跳过
        if b - a < 0.2:
            continue
        mine = rms_db(own, a - at, b - at)
        if mine > -60 and rms_db(m, a, b) < mine - 20:
            lost.append(f"{os.path.basename(f)} 在 {a:.2f}-{b:.2f}s 自身 {mine} dB，混音里 {rms_db(m, a, b)} dB")
    if lost:
        die("混音丢了声音：\n  " + "\n  ".join(lost))

def decode16k(path):
    raw = run(["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], binary=True).stdout
    s = array.array("f")
    s.frombytes(raw[: len(raw) // 4 * 4])
    return s

def rms_db(samples, t0, t1, sr=16000):
    w = samples[max(0, int(t0 * sr)):max(0, int(t1 * sr))]
    return round(20 * math.log10(math.sqrt(sum(x * x for x in w) / len(w)) + 1e-9), 1) if len(w) else -90.0

def seam_jumps(out, flat):
    """每个剪点前后 0.3 秒的响度差。听不到，但量得出来。"""
    a = decode16k(out)
    rows = []
    for it in flat[1:]:
        b, c = rms_db(a, it["t"] - 0.3, it["t"]), rms_db(a, it["t"], it["t"] + 0.3)
        rows.append({"t": it["t"], "at": it["at"], "before_db": b, "after_db": c, "jump": round(abs(c - b), 1)})
    return rows

def cmd_render(a):
    ws = Ws(a.work)
    T, facts = ws.project["target"], ws.facts()
    edl = jload(ws.p("edl.json"))
    found, _, flat, total = check_edl(edl, facts, ws.log(), ws.ids, ws.fps, ws.dir)
    if any(not it["ok"] for it in flat) or not flat:
        die("edl.json 有选段格式不对或越界，先跑 edit.py check")
    if (todo := [x for x in found if not x.get("waived")]) and not a.force:
        die(f"edl.json 有 {len(todo)} 处未处理的问题，先跑 edit.py check。只要草稿就加 --force")
    blocks, joins = [], []
    for it in flat:
        if not blocks or it["dissolve"]:
            if blocks:
                joins.append(it["dissolve"])
            blocks.append([])
        blocks[-1].append(it["sel"])
    tmp = ws.p("tmp")
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    built = [build_block(ws, k, b, tmp, T) for k, b in enumerate(blocks)]
    fi, fo = edl.get("fade_in", 0.3), edl.get("fade_out", 0.8)
    lines = cut_lines(flat, facts, edl)
    placements = sync_placements(ws, edl, flat, facts, ws.fps)
    placements += layer_placements(ws, edl, flat, ws.fps, total, [(l["t"], l["t_end"]) for l in lines])
    sound = render_sound(placements, total, fi, fo, tmp)

    ins = [x for v, _ in built for x in ("-i", v)] + ["-i", sound]
    vf, off, cv = [], built[0][1], "[0:v]"
    for k in range(1, len(built)):
        d = joins[k - 1]
        vf.append(f"{cv}[{k}:v]xfade=transition=fade:duration={d}:offset={off - d:.4f}[v{k}]")
        cv, off = f"[v{k}]", off - d + built[k][1]
    vfade = ([f"fade=t=in:d={fi}"] if fi else []) + ([f"fade=t=out:st={off - fo:.4f}:d={fo}"] if fo else [])
    vf.append(f"{cv}{','.join(vfade) or 'null'}[vo]")
    mix = f"{tmp}/mix.mkv"
    run(["ffmpeg", "-v", "error", "-y"] + ins + ["-filter_complex", ";".join(vf), "-map", "[vo]", "-map", f"{len(built)}:a",
         "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "pcm_s16le", mix])

    target = edl.get("lufs", -16)
    ln = f"loudnorm=I={target}:TP=-1.5:LRA=11"
    err = run(["ffmpeg", "-hide_banner", "-i", mix, "-vn", "-af", ln + ":print_format=json", "-f", "null", "-"]).stderr
    m = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    ln2 = (f"{ln}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
           f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    last = latest_cut(ws)   # 版本号跟报告走，渲染失败留下的半成品会被覆盖
    n = 1 + (int(re.search(r"v(\d+)\.json$", last).group(1)) if last else 0)
    out = ws.p("cuts", f"v{n}.mp4")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-i", mix, "-af", ln2, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", out])
    shutil.rmtree(tmp, ignore_errors=True)

    W, H = T["width"], T["height"]
    sheets, cols, rows = make_sheets(out, ws.p("cuts", f"v{n}_sheet"), 1, W, H, tile_w=240 if W >= H else 160)
    seams, seam_rows = seam_sheets(out, ws.p("cuts", f"v{n}_seams"), flat, T)
    lines = [{k: v for k, v in l.items() if k not in ("key", "t_end")} for l in lines]
    jumps = seam_jumps(out, flat)
    loud = [j for j in jumps if j["jump"] >= SEAM_JUMP]
    lines_txt = ws.p("cuts", f"v{n}_lines.txt")
    with open(lines_txt, "w") as f:
        f.write(f"成片台词表。时间是成片里的秒。触点图{grid_note(0, 1, cols, rows)}\n\n")
        f.write("".join(f"{l['t']:7.2f}  {l['text']}\n" for l in lines) or "（没有台词）\n")
    rep = {"out": out, "edl_sha1": sha1(ws.p("edl.json")), "duration": probe(out)["duration"], "expected": total,
           "lufs": integrated_lufs(out), "target_lufs": target, "size": f"{W}x{H}", "fps": T["fps"],
           "sheets": sheets, "sheet_grid": grid_note(0, 1, cols, rows),
           "seams": seams, "seam_rows": seam_rows, "lines": lines_txt, "seam_jumps": jumps,
           "sound": [{k: (round(v, 3) if isinstance(v, float) else v) for k, v in p.items() if k not in ("src", "duck")}
                     for p in placements],
           "segments": [{"t": it["t"], "at": it["at"], "clip": it["sel"].get("clip") or it["sel"].get("color") or "gap",
                         "in": it["sel"].get("in"), "out": it["sel"].get("out"), "frames": it["frames"]} for it in flat]}
    jdump(rep, ws.p("cuts", f"v{n}.json"))
    drift = rep["duration"] - total
    print(f"{out}\n  {rep['duration']}s（预计 {total}s，差 {drift:+.2f}s）  {rep['lufs']} LUFS（目标 {target}）")
    print(f"  整片触点图 {len(sheets)} 张，{rep['sheet_grid']}")
    print(f"  剪点图 {len(seams)} 张，每行一个剪点：出点前两帧 | 入点后两帧，行与剪点的对应见 vN.json 的 seam_rows")
    print(f"  成片台词表 {lines_txt}")
    print(f"  剪点响度跳变 ≥ {SEAM_JUMP:g} dB 的 {len(loud)} 处（进听片清单）：" +
          "，".join(f"{j['t']:.2f}s 进 {j['at']} {j['before_db']}→{j['after_db']}" for j in loud))
    print("\n".join(f"  {s}" for s in sheets + seams))

def seam_sheets(out, prefix, flat, T):
    """每个剪点一行：前一段最后两帧，后一段最前两帧。"""
    fps, cuts = T["fps"], flat[1:]
    if not cuts:
        return [], []
    tile_w = 240 if T["width"] >= T["height"] else 160
    per = max(1, SHEET_BUDGET // round(tile_w * T["height"] / T["width"]))
    tmp = prefix + "_frames"
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)
    rows = []
    for k, it in enumerate(cuts):
        first = max(0, round(it["t"] * fps) - 2)
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{(first - 0.25) / fps:.4f}", "-i", out, "-frames:v", "4",
             "-vf", f"scale={tile_w}:-2", "-q:v", "3", f"{tmp}/r{k:03d}_%d.jpg"])
        got = sorted(glob.glob(f"{tmp}/r{k:03d}_*.jpg"))
        rows.append((got + got[-1:] * 4)[:4])
    for old in glob.glob(glob.escape(prefix) + "_[0-9][0-9].jpg"):
        os.remove(old)
    files = []
    for k in range(0, len(rows), per):
        chunk = rows[k:k + per]
        lst = f"{tmp}/list{k}.txt"
        with open(lst, "w") as f:
            f.write("".join(f"file '{x}'\n" for r in chunk for x in r))
        dst = f"{prefix}_{len(files) + 1:02d}.jpg"
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst,
             "-vf", f"tile=4x{len(chunk)}", "-frames:v", "1", "-q:v", "3", dst])
        files.append(dst)
    shutil.rmtree(tmp, ignore_errors=True)
    labels = [f"{(k // per) + 1}-{k % per}: {it['t']:.2f}s 进 {it['at']}" + (f"（叠化 {it['dissolve']}s）" if it["dissolve"] else "")
              for k, it in enumerate(cuts)]
    return files, labels

def cut_lines(flat, facts, edl):
    """同期声里听得到的台词，换算到成片时间。"""
    out = []
    for it in flat:
        s = it["sel"]
        if "clip" not in s or sound_of(s, edl) not in ("mix", "voice"):
            continue
        sp = s.get("speed", 1.0)
        a0, a1 = s["in"] - s.get("lead", 0.0) * sp, s["out"] + s.get("lag", 0.0) * sp
        for l in facts[s["clip"]].get("lines") or []:
            seen = out and out[-1]["key"] == (s["clip"], l["t0"])   # 连续镜头跨两段的同一句只记一次
            if l["t0"] < a1 and l["t1"] > a0 and not seen:
                out.append({"t": round(it["t"] + (max(l["t0"], a0) - s["in"]) / sp, 2),
                            "t_end": round(it["t"] + (min(l["t1"], a1) - s["in"]) / sp, 2), "at": it["at"],
                            "text": l["text"], "key": (s["clip"], l["t0"])})
    return out

# ---------- 入口 ----------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    def add(name, fn):
        p = sp.add_parser(name)
        p.add_argument("--work")
        p.set_defaults(fn=fn)
        return p
    p = add("init", cmd_init)
    p.add_argument("src")
    p.add_argument("--lang")
    p.add_argument("--whisper-model")
    p.add_argument("--vad-model")
    p = add("analyze", cmd_analyze)
    p.add_argument("--clip", action="append")
    p.add_argument("--threshold", type=float)
    p.add_argument("--stems", action="store_true")
    p.add_argument("--force", action="store_true")
    p = add("sheet", cmd_sheet)
    p.add_argument("target")
    p.add_argument("--start", type=float, default=0.0)
    p.add_argument("--dur", type=float)
    p.add_argument("--fps", type=float, default=4)
    p.add_argument("--at", type=float)
    p.add_argument("--width", type=int)
    p = add("schema", cmd_schema)
    p.add_argument("which", nargs="?", choices=list(SCHEMA))
    add("check", cmd_check)
    add("gaps", cmd_gaps)
    add("inspect", cmd_inspect)
    p = add("render", cmd_render)
    p.add_argument("--force", action="store_true")
    a = ap.parse_args()
    a.fn(a)

if __name__ == "__main__":
    main()
