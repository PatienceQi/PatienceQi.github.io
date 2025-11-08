# Qi Jingxuan — Personal Website

A static, bilingual personal website for Qi Jingxuan. The site is built with vanilla HTML, CSS, and JavaScript and can be deployed directly on GitHub Pages using the "Static HTML" workflow template.


## Preview locally

```bash
python -m http.server
```

Open <http://localhost:8000> in your browser.

## Deployment

1. In the GitHub repository, go to **Settings → Pages**.
2. Select **Source: GitHub Actions**, choose the **Static HTML** preset, and save the workflow.
3. Commit and push the site files to `main`. GitHub Actions will build and publish the site automatically.

## Project structure

```
assets/
  css/
  js/
icons/
en/
zh/
about/
projects/
publications/
contact/
```

The `/zh` and `/en` directories hold localized pages. Shared assets live under `/assets`. Project detail pages use folder-based routing (e.g., `/en/projects/hybrid-precision/`).

## Accessibility & features

- Sticky header with language toggle and GitHub link
- Responsive cards, badges, and motion respecting `prefers-reduced-motion`
- Scroll-aware back-to-top button
- Email obfuscation and dual-address reveal logic
- BibTeX copy-to-clipboard buttons with toast feedback

> Binary assets (PNG/JPG/ICO/fonts) are intentionally omitted to satisfy Codex PR constraints. Replace with real assets in a follow-up manual commit after merge.
