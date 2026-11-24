#!/bin/sh
# Reject any staged SKILL.md over 500 lines. Reads the staged blob, not the working tree.

MAX_SKILL_LINES=500
failed=0

for f in "$@"; do
  lines=$(git show ":$f" | wc -l | tr -d ' ')
  if [ "$lines" -gt "$MAX_SKILL_LINES" ]; then
    echo "$f has $lines lines, limit is $MAX_SKILL_LINES. Move detail into reference files." >&2
    failed=1
  fi
done

exit $failed
