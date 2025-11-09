# 资源模块 (Assets) · Claude 协作指南

[根目录](../CLAUDE.md) > **assets**

> **模块职责**：全局样式 (CSS)、交互脚本 (JS)、图标资源
> **最后更新**：2025-11-09 14:53:49 CST

---

## 变更记录 (Changelog)

### 2025-11-09
- **初始化文档**：生成资源模块 CLAUDE.md，添加导航面包屑

---

## 模块职责

维护所有全局静态资源，包括：
- **CSS 样式**：基础样式、组件样式、动效与过渡
- **JavaScript 脚本**：页面交互逻辑（语言切换、滚动行为、邮箱保护、BibTeX 复制）
- **图标资源**：SVG favicon 与内联 SVG 图标

---

## 入口与启动

### CSS 加载顺序（在每个 HTML `<head>` 中）
```html
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/motion.css">
```
**加载逻辑**：
1. `base.css`：定义 CSS 变量、全局重置、基础布局（container/grid/btn）
2. `components.css`：组件样式（header/card/badge/footer/toast）
3. `motion.css`：动效类（fade-up/delay-N/parallax）

### JS 入口
```html
<script type="module" src="/assets/js/main.js"></script>
```
`main.js` 自动 import 并初始化所有子模块（i18n/email/copy）。

---

## 对外接口

### CSS 变量 API（通过 `:root` 定义）
```css
/* 颜色系统 */
--color-primary: #38bdf8;        /* 主色（淡蓝） */
--color-primary-strong: #0ea5e9; /* 强调色 */
--color-bg: #0f172a;              /* 背景深蓝 */
--color-surface: rgba(15, 23, 42, 0.7); /* 半透明卡片背景 */
--color-text: #f1f5f9;            /* 文字浅色 */
--color-muted: #94a3b8;           /* 次要文字 */

/* 间距 & 尺寸 */
--max-width: 1080px;              /* 内容最大宽度 */
--radius-lg: 20px;                /* 卡片圆角 */
--shadow-md: 0 20px 45px ...;     /* 阴影 */
--header-height: 88px;            /* Header 高度 */
--header-height-compact: 64px;    /* 滚动后压缩高度 */
```
**修改颜色**：仅需修改 `base.css` 的 `:root` 变量，所有组件自动更新。

### JavaScript 模块 API

#### `i18n.js`
```javascript
// 检测当前语言（基于 pathname）
detectCurrentLanguage(pathname) // => 'zh' | 'en'

// 推断目标语言路径（镜像切换）
inferTargetPath(currentPathname, targetLang) // => '/zh/projects/' | '/en/projects/'

// 初始化语言切换按钮（绑定点击事件 + localStorage）
initLanguageToggle(toggleButton)
```

#### `email.js`
```javascript
// 设置邮箱防爬逻辑
// 桌面端：mouseenter/focusin/click 显示备邮箱
// 移动端：直接显示
setupEmailProtection()
```

#### `copy.js`
```javascript
// 为所有带 data-bibtex 的按钮绑定复制事件
// 复制成功后显示 Toast 提示 "Copied"
setupCopyHandlers()
```

#### `main.js`
```javascript
// 入口：初始化所有功能
init() {
  initHeaderCompression();  // Header 滚动压缩
  initBackToTop();          // 返回顶部按钮
  initParallax();           // 视差效果（首屏插图）
  initLanguage();           // 语言切换
  initYear();               // 自动更新页脚年份
  setupEmailProtection();   // 邮箱防爬
  setupCopyHandlers();      // BibTeX 复制
}
```

---

## 关键依赖与配置

### CSS 依赖
- **CSS Variables**：所有颜色、间距、阴影定义在 `base.css` 的 `:root`
- **媒体查询**：
  - `@media (max-width: 768px)`：移动端断点
  - `@media (prefers-reduced-motion: reduce)`：关闭动画
  - `@media (prefers-color-scheme: light)`：浅色主题变量（当前已定义但未全局启用）

### JavaScript 依赖
- **ES6 Modules**：使用 `import/export`，浏览器原生支持
- **Web APIs**：
  - `window.matchMedia('(prefers-reduced-motion: reduce)')`：检测动效偏好
  - `localStorage.getItem/setItem('lang')`：存储语言偏好
  - `navigator.clipboard.writeText()`：BibTeX 复制

---

## 数据模型

### CSS 类命名规范（BEM 风格）
- **Block**：`.site-header`, `.back-to-top`, `.card`, `.badge`
- **Element**：`.site-header .container`, `.card-header`, `.nav-links`
- **Modifier**：`.btn.secondary`, `.badge.dark`, `.header.compact`

### 动效类（`motion.css`）
```css
.fade-up        /* 淡入 + 上移 16px */
.delay-1        /* 延迟 150ms */
.delay-2        /* 延迟 300ms */
.delay-3        /* 延迟 450ms */
.parallax       /* 视差缩放（首屏插图） */
```
所有动效在 `prefers-reduced-motion: reduce` 时自动禁用。

---

## 测试与质量

### CSS 测试清单
- [ ] **响应式**：移动端 (< 768px) 布局正常，导航隐藏/堆叠
- [ ] **可访问性**：焦点环清晰（`:focus-visible`），对比度符合 WCAG AA
- [ ] **动效**：`prefers-reduced-motion` 生效，关闭所有过渡与滚动动画
- [ ] **浅色主题**：切换系统主题后变量正确切换（当前仅定义，未全局测试）

### JavaScript 测试清单
- [ ] **语言切换**：从 `/zh/about/` 切换到 EN 跳转 `/en/about/`，localStorage 生效
- [ ] **Header 压缩**：滚动超过 120px 后 Header 高度从 88px 变为 64px
- [ ] **返回顶部**：滚动超过 600px 后按钮显示，点击平滑回顶（非 reduced-motion）
- [ ] **邮箱防爬**：联系页桌面 hover/click 显示备邮箱，移动端直接显示
- [ ] **BibTeX 复制**：论文页点击复制按钮，Toast 显示 "Copied"，剪贴板包含 BibTeX

---

## 常见问题 (FAQ)

### Q1: 如何修改主题色？
编辑 `assets/css/base.css` 的 `:root` 部分，修改 `--color-primary` 和 `--color-primary-strong`。确保对比度符合 WCAG AA 标准（工具：https://contrast-ratio.com）。

### Q2: 如何添加新的动效类？
在 `assets/css/motion.css` 中定义新的 class（如 `.slide-in`），并在 `@media (prefers-reduced-motion: reduce)` 中禁用。在 HTML 中添加对应 class。

### Q3: 如何添加新的 JavaScript 模块？
1. 在 `assets/js/` 下创建新文件（如 `analytics.js`）
2. 导出 setup 函数：`export function setupAnalytics() { ... }`
3. 在 `main.js` 中 import 并在 `init()` 中调用：
   ```javascript
   import { setupAnalytics } from './analytics.js';
   function init() {
     // ...existing code...
     setupAnalytics();
   }
   ```

### Q4: 为什么不使用 Tailwind/Bootstrap？
项目规模小，CSS 变量已能满足主题定制需求，避免引入构建步骤与冗余样式。未来如需更复杂 UI 可迁移到 Tailwind。

---

## 相关文件清单

- **CSS**：
  - `assets/css/base.css`（变量、重置、基础布局）
  - `assets/css/components.css`（header/card/badge/button/footer）
  - `assets/css/motion.css`（动效类 fade-up/delay-N）
- **JavaScript**：
  - `assets/js/main.js`（入口）
  - `assets/js/i18n.js`（语言切换）
  - `assets/js/email.js`（邮箱防爬）
  - `assets/js/copy.js`（BibTeX 复制）
- **图标**：
  - `icons/favicon.svg`（SVG favicon）

---

## 下一步建议

1. **浅色主题全局测试**：验证 `@media (prefers-color-scheme: light)` 在所有页面的表现
2. **性能优化**：考虑使用 `@supports` 检测 `backdrop-filter` 支持，降级到纯色背景
3. **CSS 变量扩展**：定义更多间距变量（如 `--spacing-xs`, `--spacing-sm`），提升一致性
4. **JavaScript 单元测试**：为 `i18n.js` 的 `inferTargetPath` 编写测试用例（可选）
