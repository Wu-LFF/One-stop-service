#!/bin/bash
# Claude Code Skills 安装脚本
# 用法：在目标项目根目录下运行此脚本
#   bash /path/to/skills-pack/src/install.sh

set -e

SKILLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.claude/skills"
TARGET_DIR="$(pwd)/.claude/skills"

echo "📦 Claude Code Skills 安装工具"
echo "=============================="
echo "目标项目: $(pwd)"
echo ""

# 检查目标目录是否已有 skills
if [ -d "$TARGET_DIR" ] && [ "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]; then
  echo "⚠️  目标目录已存在 skills: $TARGET_DIR"
  echo "  将跳过已存在的技能，只补充新增的。"
  echo ""
fi

# 创建目录
mkdir -p "$TARGET_DIR"

# 复制技能
COUNT=0
for SKILL in "$SKILLS_DIR"/*/; do
  NAME=$(basename "$SKILL")
  if [ -d "$TARGET_DIR/$NAME" ]; then
    echo "⏭️  跳过 $NAME（已存在）"
  else
    cp -r "$SKILL" "$TARGET_DIR/$NAME"
    echo "✅ 安装 $NAME"
    COUNT=$((COUNT + 1))
  fi
done

echo ""
if [ "$COUNT" -gt 0 ]; then
  echo "🎉 安装完成！新安装了 $COUNT 个技能。"
else
  echo "✨ 所有技能已是最新，无需安装。"
fi
echo ""
echo "现在可以在 Claude Code 中使用以下命令："
for SKILL in "$TARGET_DIR"/*/; do
  if [ -f "$SKILL/SKILL.md" ]; then
    NAME=$(basename "$SKILL")
    DESC=$(head -5 "$SKILL/SKILL.md" | grep "^description:" | sed 's/^description: *//')
    echo "  /$NAME  — $DESC"
  fi
done
echo ""
echo "📖 详细说明见 skills-pack/README.md"
