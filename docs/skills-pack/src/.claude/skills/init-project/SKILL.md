---
name: init-project
description: 一键生成标准化项目骨架，包含目录结构、CLAUDE.md、.gitignore 和基础配置，让每个项目都遵循统一规范
version: 1.0.0
---

# Init Project — 项目脚手架初始化

为新项目生成标准化目录结构和规范文档，确保项目风格统一。

## 使用方式

在对话中输入 `使用 init-project`、`/init-project` 或 `初始化项目` 触发。

## 流程

按以下步骤顺序执行，不要跳过。

### 步骤 1：确认项目信息

询问用户以下信息：

1. **项目名称**（英文短名，如 `one-stop-service`）
2. **项目中文名**（如 "一站式服务平台"）
3. **项目简介**（一句话描述）
4. **技术栈**（前端框架/后端框架/数据库等）
5. **项目类型**（前端项目 / 全栈项目 / 库 / 工具）

### 步骤 2：创建目录结构

创建标准化项目骨架：

```
{project-name}/
├── .claude/
│   ├── skills/           # Claude Code 技能目录
│   └── settings.json     # 权限配置
├── .vscode/              # VS Code 统一配置
│   └── settings.json
├── docs/                 # 文档目录
├── src/                  # 源代码
├── tests/                # 测试
├── .gitignore
├── README.md
├── CLAUDE.md             # 项目"宪法"
└── package.json          # 或其他构建配置
```

### 步骤 3：生成 CLAUDE.md

写入以下内容：

```markdown
# CLAUDE.md — {项目中文名}

## 项目概览

{项目简介}

## 开发规范

- 功能实现前先阅读 `docs/` 相关文档
- 修改代码后同步更新相关文档
- 提交信息使用中文，简洁描述变更原因
- 涉及新增规范时同步更新 CLAUDE.md

## 常用命令

（根据技术栈写入对应命令）
```

### 步骤 4：生成 .gitignore

根据技术栈生成对应的 .gitignore（Node.js / Python / Java 等标准模板）。

### 步骤 5：生成 .vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 步骤 6：初始化 Git

```bash
git init
git add .
git commit -m "初始化 {项目中文名} — 项目骨架"
```

### 步骤 7：输出总结

列出已创建的文件和下一步建议。

## 注意事项

- 如果目录已存在，不要覆盖已有文件，询问用户后再操作
- 目录名使用小写字母 + 连字符（kebab-case）
- 如果用户已有自己的目录偏好，优先满足用户习惯
