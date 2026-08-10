#!/usr/bin/env python3
"""校验仓库中的 Claude Code skills。"""

from __future__ import annotations

import re
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
DOMAINS = ("engineering", "generation", "product", "web-design")
FRONTMATTER = re.compile(r"\A---\n(.*?)\n---(?:\n|\Z)", re.DOTALL)
NAME = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate(skill_file: Path, seen_names: set[str]) -> list[str]:
    errors: list[str] = []
    content = skill_file.read_text(encoding="utf-8")
    match = FRONTMATTER.match(content)
    if not match:
        return [f"{skill_file}: 缺少有效 YAML frontmatter"]

    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError as error:
        return [f"{skill_file}: YAML 无效：{error}"]
    if not isinstance(data, dict):
        return [f"{skill_file}: frontmatter 必须是 mapping"]

    name = data.get("name")
    if not isinstance(name, str) or not NAME.fullmatch(name) or len(name) > 64:
        errors.append(f"{skill_file}: name 必须是最长 64 字符的 kebab-case")
    elif name != skill_file.parent.name:
        errors.append(f"{skill_file}: name 必须与目录名一致")
    elif name in seen_names:
        errors.append(f"{skill_file}: skill name 重复：{name}")
    else:
        seen_names.add(name)

    description = data.get("description")
    if not isinstance(description, str) or not description.strip():
        errors.append(f"{skill_file}: description 必须是非空字符串")
    elif len(description) > 1024:
        errors.append(f"{skill_file}: description 不能超过 1024 字符")

    for field in ("disable-model-invocation", "user-invocable"):
        if field in data and not isinstance(data[field], bool):
            errors.append(f"{skill_file}: {field} 必须是 boolean")
    return errors


def main() -> int:
    skill_files = [
        skill_file
        for domain in DOMAINS
        for skill_file in sorted((ROOT / domain).glob("*/SKILL.md"))
    ]
    seen_names: set[str] = set()
    errors = [error for skill_file in skill_files for error in validate(skill_file, seen_names)]
    if errors:
        print("\n".join(errors))
        return 1
    print(f"通过：{len(skill_files)} 个 Claude Code skills。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
