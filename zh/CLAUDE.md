# 中文版内容模块 · Claude 协作指南

[根目录](../CLAUDE.md) > **zh**

> **模块职责**：中文版页面内容（首页、关于、项目、论文、联系）
> **最后更新**：2025-11-09 15:01:56 CST

---

## 变更记录 (Changelog)

### 2025-11-09 15:01
- **增量更新**：补充扫描 `coral-rag-qa` 与 `ai-customer-service` 项目详情页，覆盖率从 85.7% 提升至 100%

### 2025-11-09 14:53
- **初始化文档**：生成模块级 CLAUDE.md，添加导航面包屑

---

## 模块职责

维护所有中文版内容页面，包括：
- **首页** (`index.html`)：Hero、亮点速览、精选项目、合作邀请
- **关于** (`about/index.html`)：个人简介、教育经历、研究兴趣、技能、影像
- **项目列表** (`projects/index.html`)：所有项目卡片列表
- **项目详情** (`projects/<slug>/index.html`)：单个项目的 Problem/Approach/Results/Role/Links
  - **hybrid-precision**：混合精度训练流水线
  - **coral-rag-qa**：检索增强问答系统（CORAL 流水线）
  - **ai-customer-service**：AI 客服自动化系统（意图识别 + 流程编排）
- **论文** (`publications/index.html`)：期刊/会议/预印本列表，支持 BibTeX 复制
- **联系** (`contact/index.html`)：邮箱、合作邀请

---

## 入口与启动

**入口文件**：`zh/index.html`
**依赖脚本**：`/assets/js/main.js`（通过 `<script type="module">` 加载）
**依赖样式**：`/assets/css/base.css`, `/assets/css/components.css`, `/assets/css/motion.css`

所有页面通过相对路径引用全局资源（`href="/assets/..."`），无需单独构建。

---

## 对外接口

### 语言切换 API
- **路径约定**：`/zh/<path>` ↔ `/en/<path>` 镜像
- **语言检测**：通过 `i18n.js` 的 `detectCurrentLanguage(pathname)` 识别当前语言
- **切换逻辑**：点击 Header 语言切换按钮 (`<button class="lang-toggle">`) 触发 `inferTargetPath` 跳转

### 导航结构
```html
<nav class="nav-links" aria-label="Primary navigation">
  <a href="/zh/about/">关于</a>
  <a href="/zh/projects/">项目</a>
  <a href="/zh/publications/">论文</a>
  <a href="/zh/contact/">联系</a>
</nav>
```
当前页链接需添加 `aria-current="page"`。

---

## 关键依赖与配置

### 全局 CSS 变量（`/assets/css/base.css`）
```css
--color-primary: #38bdf8;      /* 主色 */
--color-bg: #0f172a;            /* 背景深蓝 */
--color-text: #f1f5f9;          /* 文字浅色 */
--radius-lg: 20px;              /* 卡片圆角 */
--shadow-md: 0 20px 45px ...;   /* 阴影 */
```

### JavaScript 模块
- `main.js`：初始化 header 压缩、返回顶部、语言切换、年份、邮箱保护、BibTeX 复制
- `i18n.js`：语言切换逻辑（localStorage 存储偏好，自动跳转镜像路径）
- `email.js`：邮箱防爬（桌面 hover/click 显示备邮箱）
- `copy.js`：BibTeX 复制与 Toast 提示

---

## 数据模型

### 项目卡片结构
```html
<article class="card">
  <div class="card-header">
    <h3><a href="/zh/projects/<slug>/">项目标题</a></h3>
    <div class="badge-row">
      <span class="badge">技术标签</span>
      <span class="badge">年份</span>
    </div>
  </div>
  <p>2-3 行项目摘要</p>
  <div class="meta-row">
    <a class="icon-button" href="..." aria-label="查看 GitHub">...</a>
    <a class="icon-button" href="..." aria-label="查看报告">...</a>
  </div>
</article>
```

### 项目详情页结构（固定顺序）
1. **Hero**：项目标题 + tagline
2. **问题** (Problem)：背景与挑战
3. **方法** (Approach)：技术方案 + 架构图（SVG 占位）
4. **结果** (Results)：数据表格或关键指标
5. **职责** (Role)：个人贡献列表
6. **链接** (Links)：GitHub/报告/演示等外链

**已验证项目结构一致性**：
- `hybrid-precision`：混合精度训练（完整 6 节结构）
- `coral-rag-qa`：CORAL 流水线（完整 6 节结构，Results 包含响应时间与正确率对比表）
- `ai-customer-service`：客服自动化（完整 6 节结构，Results 包含自动化覆盖率与满意度对比表）

### 论文条目结构
```html
<article class="card">
  <h3>论文标题</h3>
  <p><strong>戚境轩</strong>, 合著者1, 合著者2</p>
  <p>期刊/会议名 · 年份</p>
  <div class="publication-actions">
    <a class="btn secondary" href="..." target="_blank">DOI/ArXiv</a>
    <button class="btn" type="button" data-bibtex="@article{...}">复制 BibTeX</button>
  </div>
</article>
```
注意：作者列表中**本人姓名必须加粗** (`<strong>戚境轩</strong>`)。

---

## 测试与质量

### 手动测试清单
- [ ] **导航高亮**：当前页链接有 `aria-current="page"`
- [ ] **语言切换**：从 `/zh/about/` 切换到 EN 后跳转 `/en/about/`
- [ ] **邮箱防爬**：联系页桌面 hover/click 显示备邮箱，移动端直接显示
- [ ] **BibTeX 复制**：论文页点击复制按钮，Toast 显示 "Copied"
- [ ] **卡片悬停**：项目卡片 hover 时上移 4px，阴影加深
- [ ] **返回顶部**：滚动超过 600px 后按钮出现，点击平滑回顶

### 可访问性
- 所有图标按钮有 `aria-label`
- SVG 插图有 `role="img"` 与 `aria-label` 描述
- 表格有 `<thead>` 与 `<th scope="col">`
- 焦点环清晰（`:focus-visible`）

---

## 常见问题 (FAQ)

### Q1: 如何添加新项目？
1. 在 `projects/` 下创建 `<slug>/index.html`（复制 `hybrid-precision/index.html` 结构）
2. 更新项目列表页 `projects/index.html` 的卡片
3. 同步更新英文版 `/en/projects/<slug>/index.html` 与 `/en/projects/index.html`
4. 可选：更新首页 "精选项目" 区块

### Q2: 如何修改首页 Hero 文案？
编辑 `zh/index.html` 的 `<section class="hero">` 部分，对应英文版在 `/en/index.html`。

### Q3: 论文列表如何排序？
按发表类型（期刊 > 会议 > 预印本）与年份降序，每个类型单独 `<section>`。

---

## 相关文件清单

- **内容页面**：
  - `zh/index.html`（首页）
  - `zh/about/index.html`（关于）
  - `zh/projects/index.html`（项目列表）
  - `zh/projects/hybrid-precision/index.html`（混合精度训练）
  - `zh/projects/coral-rag-qa/index.html`（检索增强问答）
  - `zh/projects/ai-customer-service/index.html`（AI 客服自动化）
  - `zh/publications/index.html`（论文）
  - `zh/contact/index.html`（联系）
- **全局资源**：`/assets/css/`, `/assets/js/`, `/icons/favicon.svg`
- **镜像英文版**：`/en/` 目录下对应文件

---

## 下一步建议

1. **SEO 优化**：每个页面检查 `<title>` 与 `<meta name="description">` 是否精准
2. **结构化数据**：在 `about/index.html` 中添加 `<script type="application/ld+json">` (schema.org/Person)
3. **多语言 SEO**：添加 `<link rel="alternate" hreflang="zh-Hans" href="...">` 与 `hreflang="en"` 标签
