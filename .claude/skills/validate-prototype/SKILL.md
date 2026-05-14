---
name: validate-prototype
description: 验证HTML原型文件的所有导航链接、页面跳转、交互事件是否正确，检查是否存在断链或无效目标
version: 1.0.0
---

# Validate Prototype — 原型文件验证

验证 HTML 原型文件中所有导航、跳转和交互事件的正确性，确保无断链或无效目标。

## 使用方式

在对话中输入 `使用 validate-prototype`、`/validate-prototype` 或 `验证原型` 触发。

## 流程

按以下步骤顺序执行，不要跳过。

### 步骤 1：读取原型文件

- 定位原型文件路径，通常位于 `docs/03-原型方案/{模块名}.html`
- 读取完整的 HTML 文件内容

### 步骤 2：提取导航目标和页面定义

从 HTML 中提取以下三类结构和对应的导航映射：

#### 2a. 移动端页面（m-page）

提取所有 `id` 属性以 `mp-` 开头的 `.m-page` 元素，记录其 `id` 作为页面目标。

#### 2b. PC 端页面（pc-page）

提取所有 `id` 属性以 `pc-` 开头的 `.pc-page` 元素，记录其 `id` 作为页面目标。

#### 2c. 管理门户页面（portal-page）

提取所有 `id` 属性以 `portal-` 开头的 `.portal-page` 元素，记录其 `id` 作为页面目标。

### 步骤 3：提取所有导航引用

从 HTML 中提取以下四种导航引用来源：

1. **`onclick="mNav('...')"` 引用** — 记录所有传递给 `mNav()` 的页面 ID 参数
2. **`data-pc` 属性值** — PC 侧边栏导航按钮上的 `data-pc` 取值
3. **`data-portal` 属性值** — 门户侧边栏导航按钮上的 `data-portal` 取值
4. **`onclick` 中调用的函数名** — 记录所有被调用的 JavaScript 函数（如 `showToast`、`mSwitchTab`、`mGoBack`、`shareProto` 等）

### 步骤 4：逐项校验

#### 4a. 校验 mNav 目标

对每个 `mNav('xxx')` 调用：
- 检查是否存在一个 `id="xxx"` 的 `.m-page` 元素
- 若不存在，报告为 **断链**

#### 4b. 校验 data-pc 映射

对每个 `data-pc` 值：
- 检查是否存在一个 `id` 与 `data-pc` 值相同的 `.pc-page` 元素
- 若不存在，报告为 **断链**

#### 4c. 校验 data-portal 映射

对每个 `data-portal` 值：
- 检查是否存在一个 `id` 与 `data-portal` 值相同的 `.portal-page` 元素
- 若不存在，报告为 **断链**

#### 4d. 校验函数定义

对每个 `onclick` 中调用的函数名（如 `mNav`、`showToast`、`mSwitchTab`、`mGoBack`、`shareProto`、`pcNav`、`portalNav`）：
- 检查 JavaScript 中是否存在对应的 `function` 定义
- 若不存在，报告为 **缺失函数定义**

#### 4e. 校验重复 ID

- 检查所有页面元素（`.m-page`、`.pc-page`、`.portal-page`）的 `id` 是否存在重复
- 若存在重复，报告为 **重复 ID**

### 步骤 5：输出验证报告

按以下格式输出验证结果：

```
## 验证报告：{文件名}

### 总览
- 移动端页面 (m-page): {数量}
- PC 端页面 (pc-page): {数量}
- 门户页面 (portal-page): {数量}
- 导航引用总数（mNav + data-pc + data-portal）: {数量}

### 校验结果

✅ / ❌ mNav 移动端导航: {通过数}/{总数}
  - 断链列表（如果有）
  
✅ / ❌ data-pc PC 端导航: {通过数}/{总数}
  - 断链列表（如果有）

✅ / ❌ data-portal 门户导航: {通过数}/{总数}
  - 断链列表（如果有）

✅ / ❌ 函数定义: {通过数}/{总数}
  - 缺失函数列表（如果有）

✅ / ❌ ID 唯一性: 无重复 / 发现重复
  - 重复 ID 列表（如果有）

### 总体状态
✅ 通过 / ❌ 存在问题
```

## 注意事项

- 只验证 `onclick` 属性中的导航引用，不验证通过 JS 事件监听器动态绑定的跳转（因为它们需要运行时才能确认）
- 对于 `showToast`、`switchView` 等非导航类函数，只检查其定义是否存在，不校验其内部逻辑
- 如果原型文件过大无法一次读取，可以分段落读取后再汇总分析
- 报告中的断链默认按严重程度排序：缺失页面 > 缺失函数 > 重复 ID
