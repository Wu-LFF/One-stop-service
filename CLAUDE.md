# CLAUDE.md — One-stop_service

## 项目概览

制造与物流园区一站式服务平台 — 构建统一身份认证、线上办事、审批协同、数据服务的综合平台

## 开发规范

- 功能实现前先阅读 `docs/requirements.md` 和 `docs/architecture.md`
- 修改代码后同步更新相关 `docs/` 文档
- 遵循 `docs/architecture.md` 中定义的技术栈和架构约束
- 涉及新增工作方法/流程/规范时，同步更新 `docs/项目工作法.md`（项目工作法文档）
- 提交信息使用中文，简洁描述变更原因

## 工作流

```
你修改 docs/requirements.md
        ↓
告诉 Claude "按需求文档实现"
        ↓
Claude 读取文档，产出代码
        ↓
git commit 记录版本对应关系
```

## 常用命令

<!-- TODO: 根据项目补充常用命令，如 npm run dev、go test 等 -->
