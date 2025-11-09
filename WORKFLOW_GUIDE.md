# 协作与发布流程（v1）

> 目的：规范内容更新、分支策略、PR 自动合并与 GitHub Pages 部署；并给出“禁止二进制资产”的约束以适配 Codex PR 渠道。

## 0. 仓库与分支

- 主分支：`main`（受保护）
- 贡献分支：以 `codex/<feature>` 命名（便于自动开启 Auto-merge）
- 目录结构（摘要）：
  `index.html`、`/zh`、`/en`、`/about`、`/projects`（含各详情 `/<slug>/index.html`）、`/publications`、`/contact`、`/assets/{css,js,icons,img?}`

## 1. 内容来源

- 文案与字段模型见《内容字段映射与交付清单（v1）》
- 线框与交互参见《个人网站线框规格（v1）》
- 设计总览与验收项见 `DESIGN_OVERVIEW.md`

## 2. 二进制资产政策（Codex PR 约束）

- **允许**：`.html .css .js .svg .md .yml .yaml .json .txt`
- **禁止**：`.png .jpg .jpeg .webp .gif .ico .ttf .otf .woff .woff2 .pdf` 等
- 处理方式：图像与图标使用 **SVG** 或 **CSS 渐变** 占位；favicon 用 `icons/favicon.svg`
- 若需要正式 PNG 等资产，请在 **合并后** 以普通提交添加

## 3. PR 流程（自动合并）

- 开启仓库的 **Allow auto-merge**
- 自动开启 Auto-merge 的工作流：`.github/workflows/enable-automerge.yml`
  - 触发：当 PR 分支名以 `codex/` 开头，或 PR 打上 `automerge` 标签
  - 合并方式：**squash**
- 极简必需检查：`.github/workflows/pr-guard.yml`
  - 校验 `index.html`、`/zh/index.html`、`/en/index.html` 存在
  - 在 **Branch protection（main）** 中将 `PR Guard / check-minimum` 设为 Required
- 合并后：Pages 工作流自动部署

## 4. Pages 部署

- 工作流文件：`.github/workflows/github-pages.yml`
  触发建议：
  ```yaml
  on:
    push:
      branches: [ main ]
    # 可选：在 PR 阶段也跑
    # pull_request:
    #   branches: [ main ]
    workflow_dispatch:
  ```
