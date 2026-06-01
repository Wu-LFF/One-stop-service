# CLAUDE.md — One-stop_service

## 项目概览

制造与物流园区一站式服务平台 — 构建统一身份认证、线上办事、审批协同、数据服务的综合平台

## 规范

- 功能实现前阅读 `docs/requirements.md` 和 `docs/architecture.md`
- 修改代码后同步更新相关 `docs/` 文档
- 新增工作方法/流程时，同步更新 `docs/项目工作法.md`
- 提交信息使用中文

## HTML 原型规范

生成 HTML 原型时遵守以下规则，禁止自行发明新样式或新结构。

### 产出约定

- 输出到 `docs/03-原型方案/{模块名}/`，文件命名：`{模块名}-{子模块名}.html`
- 必须在 README 模块索引中登记新页面
- 完成后运行 `validate-prototype` 技能验证断链

### 架构：三端合一

每个 HTML 文件必须包含三个视图，通过顶栏 View Switcher 切换：

| 视图 | CSS 选择器 | 页面 class | 导航函数 |
|------|-----------|-----------|---------|
| 手机端 | `#mobileView` | `.m-page` | `mNav('mp-xxx')` |
| PC端 | `#pcView` | `.pc-page` | `pcNav('pc-xxx')` |
| 管理门户 | `#portalView` | `.portal-page` | `portalNav('portal-xxx')` |

### 设计系统（CSS 变量）

必须复用以下 CSS 变量，不得自造颜色值：

```css
:root {
  --p: #1E6DF2; --pd: #1557C4; --pl: #E8F0FE;        /* 主色 */
  --s: #34A853; --w: #FBBC04; --d: #EA4335;           /* 成功/警告/危险 */
  --xp: #E60012; --xpl: #FFE8EA; --di: #FEE8E8;       /* 强调红 */
  --bg: #F5F7FA; --cd: #FFF;                           /* 背景/卡片 */
  --t1: #1F2937; --t2: #6B7280;                        /* 文字 */
  --bd: #E5E7EB; --sd: 0 2px 12px rgba(0,0,0,.08);     /* 边框/阴影 */
  --r: 12px; --r-sm: 8px;                               /* 圆角 */
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --trans: all .3s cubic-bezier(.4,0,.2,1);
}
```

### 组件库（必须复用）

| 用途 | 使用 class | 禁止 |
|------|-----------|------|
| 卡片容器 | `.card` 或 `.db-card` | 自己写 box-shadow/border |
| 按钮-主操作 | `.btn .btn-p` | 自己写 background |
| 按钮-成功 | `.btn .btn-s` | |
| 按钮-描边 | `.btn .btn-outline` | |
| 小按钮 | `.btn .btn-sm` | |
| 通栏按钮 | `.btn .btn-block` | |
| 徽章/标签 | `.badge .badge-p0 / .badge-p1 / .badge-s / .badge-info` | |
| 表单控件 | `.form-group > label + .form-control` | 自己写 input 样式 |
| 表格 | `table`（复用全局样式） | 自己写表格 CSS |
| 表格操作按钮 | `.btn-act .btn-act-p / .btn-act-s / .btn-act-d / .btn-act-w` | |
| 模态弹窗 | `openModal(title, html, footer)` / `closeModal()` | 自己建弹窗框架 |
| Toast | `showToast(msg)` | 自己写 toast |
| 统计卡片 | `.stat-card` | |
| 网格布局 | `.grid-2 / .grid-3 / .grid-4` | 自己写 grid |
| 菜单入口卡片 | `.menu-grid > .menu-card` | |
| 场景入口卡片 | `.scene-card` | |
| 移动端 Tab 切换 | `.m-tabs > .m-tab` + `.m-tab-content` | |
| 进度步骤条 | `.progress-steps > .progress-step` | |
| 审批链 | `.approve-chain > .node + .arrow` | |
| 详情字段网格 | `.detail-grid > .field` | |
| 分区标题(PC) | `.pc-section-title > .bar + h2` | |
| 下拉面板 | `.dropdown-panel` / `.dropdown-menu` | |

### 交互模式（必须复用）

```js
// 移动端导航（自动维护返回栈）
function mNav(pageId)           // 跳转到指定 m-page，前一个页面入栈
function mGoBack()              // 返回上一页，栈空时回到首页

// PC端导航
function pcNav(pageId)          // 切换 pc-page，更新侧边栏高亮

// 管理门户导航
function portalNav(pageId)      // 切换 portal-page，更新侧边栏高亮

// 全局工具
function showToast(msg)         // 底部居中黑色 toast，2.5s 自动消失
function openModal(title, bodyHTML, footerHTML)  // 打开模态弹窗
function closeModal()           // 关闭模态弹窗
function switchView(view)       // 切换 mobile/pc/portal 视图
```

### 页面 ID 命名规范

- 移动端：`mp-{模块缩写}-{页面名}`（如 `mp-aq-index` = 行政通安全板块首页）
- PC端：`pc-{模块缩写}-{页面名}`（如 `pc-aq-index`）
- 管理门户：`portal-{模块缩写}-{页面名}`（如 `portal-aq-index`）

### 生成前必读

输出新模块原型前，必须先读取 `docs/03-原型方案/行政通/行政通.html` 确认最新的样式和组件模式。以该文件为准，不要凭记忆生成。

### 生成后自检清单

每轮输出前自查：
- [ ] CSS 变量是否全部复用（无自造颜色）
- [ ] 三端视图是否都已实现
- [ ] 组件 class 是否复用（无重复造轮子）
- [ ] 页面 ID 是否符合命名规范
- [ ] 导航函数是否使用 mNav/pcNav/portalNav
- [ ] README 索引是否已更新
