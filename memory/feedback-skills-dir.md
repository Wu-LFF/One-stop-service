---
name: feedback-skills-dir
description: init-project skill 的 project structure 需要包含 .claude/skills/ 目录
metadata:
  type: feedback
---

项目初始化时必须包含 `.claude/skills/` 目录，用于存放项目级 skill。

**Why**: 项目需要专属 skill（如 prototype-designer），统一放在 `.claude/skills/` 下便于管理。

**How to apply**: 已更新 init-project v1.1.0，新项目自动包含该目录。手动创建时也要补上。
