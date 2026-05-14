---
name: organize-docs-skill
description: 用户要求自动分类 docs/ 下新增文档，已创建 organize-docs skill
metadata:
  type: feedback
---

用户希望投递文档到 docs/ 后能自动归类。已创建 `organize-docs` skill 处理此需求。

**Why**: 后续还会收到多份文档（Word、Excel、图片等），需要及时归类到 01-蓝图方案、02-业务需求（含 HR人事/行政/生产/通用模块）、03-原型方案、04-PRD 等子目录。

**How to apply**: 用户投放文件后，调用 `prototype-designer` 或 `organize-docs` skill 执行归类。如果是新格式/新需求，先与用户确认归属再移动。
