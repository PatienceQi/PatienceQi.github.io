# 戚境轩个人网站 · 设计总览（v1.5）

> 目的：作为团队与未来贡献者的“单页真相来源”，概述信息架构、视觉与交互规范、可访问性、SEO 与内容模型。配套协作与发布流程见 `WORKFLOW_GUIDE.md`。

## 0. 基本信息

- 站点：个人学术与项目展示（双语镜像 `/zh/...` 与 `/en/...`，默认中文）
- 导航（中 / EN）：关于 / 项目 / 论文 / 联系  |  About / Projects / Publications / Contact
- 托管：GitHub Pages（Actions → Static HTML）
- 研究标签：AI · ML · DL · RAG（可扩：KG / Evaluation）

---

## 1. 信息架构（IA）

**页面**

- Home（/zh, /en）
- About（/zh/about, /en/about）
- Projects（列表 /zh/projects, /en/projects；详情 /zh/projects/`<slug>`, /en/...）
- Publications（/zh/publications, /en/publications）
- Contact（/zh/contact, /en/contact）
- 404（/404.html，含语言切换）

**首页模块顺序**：Hero → Highlights（3项）→ Featured Projects（3卡）→ CTA

**项目详情固定结构**：问题（Problem）→ 方法（Approach）→ 结果（Results）→ 职责（Role）→ 链接（Links）

**About 特殊区块**：Awards/荣誉（*当前隐藏*）与 1–2 张照片占位

---

## 2. 视觉与品牌（Brand）

- **主色**：淡蓝（建议 #60A5FA / #3B82F6）
- **背景**：深蓝（建议 #0F172A / #0B1B3B），渐变可用线性深浅
- **字体**：系统字体栈；中文回退思源黑体；英文字体建议 Inter/Roboto（可系统等价）
- **Logo**：Q 几何方向；导航用“图形 + Qi Jingxuan”，favicon 仅图形
- **OG 模板**：深蓝渐变 + Q 几何 Logo + 姓名 + 标签线（AI • ML • DL • RAG • KG • Evaluation）

**组件风格**

- Card：圆角 16–20px、阴影轻、留白足
- Chip/Badge：对比度 AA，可多枚横排
- Buttons：主次分明，焦点环清晰（:focus-visible）

---

## 3. 交互与动效（Motion）

- 入场：模块分批淡入 + 上移 12–16px；150–250ms；延迟阶梯
- 滚动：Header 80–120px 后压缩；返回顶部按钮在 `scrollY>600` 显示
- 视差/微缩放：仅首屏插图与项目封面，幅度 ≤ 4%
- **可访问性优先**：尊重 `prefers-reduced-motion` → 关闭动效

---

## 4. 可访问性（A11y）

- 语义化结构：`header/nav/main/section/article/footer`
- 键盘可达：Tab 顺序合理；按钮支持 Enter/Space；焦点环明显
- 图标与图片：提供 `aria-label` / `alt` 文案
- 语言切换：按钮具备说明（“切换到 English/中文”）；切换后保持镜像路径
- 邮箱防爬：桌面默认仅显主邮箱，hover/click 显示备邮箱；移动端纯文本

---

## 5. SEO 与元信息

- `<title>` 模板
  - 首页（/zh）：`戚境轩｜人工智能 · 机器学习 · 深度学习 · RAG`
  - Home（/en）：`Qi Jingxuan | AI • ML • DL • RAG`
  - 项目详情：`{Project Title} — Qi Jingxuan`
  - Publications：`Publications — Qi Jingxuan`
- Meta：描述160字内；OG/Twitter 基础标签（`og:title/description`；`og:image` 可后补）
- 结构化数据：`schema.org/Person`（基础）与 `BreadcrumbList`（可选）
- **无统计、无 Cookie Banner**（当前阶段）

---

## 6. 内容模型（摘要）

- **首页**
  - Hero：标题、标签线、简介（1–2句）、院校/城市行、兴趣 chips、两个按钮（查看项目 / 邮件联系）
  - Highlights（3）：Hybrid Precision → CORAL RAG → AI 客服
  - Featured（3）：Hybrid Precision / CORAL RAG QA / AI 客服（链接顺序固定 **GitHub → 报告**）
- **Projects**
  - 列表卡：标题、2行摘要、Badges（数据集/年份/方法）、外链图标（无则隐藏）
  - 详情：Problem/Approach/Results/Role/Links +（图/表占位）
- **Publications**
  - 分组：期刊/会议/预印本，组内按年份↓
  - 字段：标题、作者（**加粗 Qi**）、venue、年份、[DOI][ArXiv][复制 BibTeX]
- **Contact**
  - 主邮箱（默认显示）+ 备邮箱（hover/click 显示）；CTA 文案中英一致

---

## 7. 颜色与尺寸建议（Tokens）

- Spacing：8 的倍数（8/16/24/32/48）
- Radius：16（卡片），8（按钮）
- 字级（Desktop）：H1 40–48 / H2 28–32 / Body 16–18
- 阴影：`0 6px 20px rgba(0,0,0,.15)`（卡片）

---

## 8. 验收清单（DoD）

- 3 秒内识别“戚境轩 Qi Jingxuan”与标签线
- 语言切换保持镜像路径；偏好存储（不强跳）
- 返回顶部阈值与动画正确；Reduced motion 生效
- Projects 外链缺失不显示图标；详情结构完整
- Publications 正确加粗作者名；BibTeX 可复制
- 页脚：`© {year} Qi Jingxuan` + GitHub 图标；无追踪/无 Cookie 提示

> 配套流程与自动化见 `WORKFLOW_GUIDE.md`。
>
