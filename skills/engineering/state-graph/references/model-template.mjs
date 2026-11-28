// 模型文件模板：两个人共用一个单人卫生间，先看门牌再进门。
// 复制到仓库外的临时目录后改写；文件名会成为输出图片的文件名。

const PEOPLE = ["小A", "小B"]

// 快照只放判断规矩所需的字段：共享状态，加每个参与者走到哪一步。
export const init = { sign: "无人", where: { 小A: "外面", 小B: "外面" } }

// 每项是一个参与者在真实系统里一次原子完成的事。
// 「看牌」和「进门翻牌」之间没有锁，所以是两个动作。
export function actions(s) {
  const next = []
  for (const p of PEOPLE) {
    const move = (where, sign = s.sign) => ({ sign, where: { ...s.where, [p]: where } })
    if (s.where[p] === "外面" && s.sign === "无人") next.push([`${p} 看牌`, move("正要进")])
    if (s.where[p] === "正要进") next.push([`${p} 进门翻牌`, move("里面", "有人")])
    if (s.where[p] === "里面") next.push([`${p} 出来`, move("外面", "无人")])
  }
  return next
}

export function check(s) {
  return PEOPLE.every((p) => s.where[p] === "里面") ? "两个人都在里面" : null
}

export function describe(s) {
  return `门牌：${s.sign}\n${PEOPLE.map((p) => `${p} ${s.where[p]}`).join("　")}`
}

// 可选。所有流程都有合法终点时导出，例如 (s) => PEOPLE.every((p) => s.where[p] === "办完")。
// export function done(s) { return false }
