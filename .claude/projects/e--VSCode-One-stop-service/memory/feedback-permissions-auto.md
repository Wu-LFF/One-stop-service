---
name: feedback-permissions-auto
description: 用户希望默认允许文件读写等操作，不要频繁弹权限提示
metadata:
  type: feedback
---

用户不喜欢频繁的权限确认弹窗，希望文件编辑(Edit)、写入(Write)、读取(Read)、搜索(Glob/Grep)等操作默认允许执行，不要每次弹提示问是否允许。

**原因**：频繁弹窗打断工作流，影响效率。

**如何应用**：在 `settings.json` 的 `permissions.allow` 中放行这些操作，减少不必要的权限提示。
