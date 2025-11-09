# English Content Module · Claude Collaboration Guide

[Root](../CLAUDE.md) > **en**

> **Module Responsibility**: English version pages (Home, About, Projects, Publications, Contact)
> **Last Updated**: 2025-11-09 15:01:56 CST

---

## Changelog

### 2025-11-09 15:01
- **Incremental Update**: Added `coral-rag-qa` and `ai-customer-service` project detail pages, coverage improved from 85.7% to 100%

### 2025-11-09 14:53
- **Initial Documentation**: Generated module-level CLAUDE.md with navigation breadcrumbs

---

## Module Responsibility

Maintains all English content pages, including:
- **Home** (`index.html`): Hero, Highlights, Featured Projects, CTA
- **About** (`about/index.html`): Bio, Education, Research Interests, Skills, Photos
- **Projects List** (`projects/index.html`): All project cards
- **Project Details** (`projects/<slug>/index.html`): Problem/Approach/Results/Role/Links
  - **hybrid-precision**: Mixed-precision training pipeline
  - **coral-rag-qa**: Retrieval-augmented QA system (CORAL pipeline)
  - **ai-customer-service**: AI customer service automation (Intent + Orchestration)
- **Publications** (`publications/index.html`): Journal/Conference/Preprint lists with BibTeX copy
- **Contact** (`contact/index.html`): Email, Collaboration invitation

---

## Entry Points & Startup

**Entry File**: `en/index.html`
**Dependencies**:
- Scripts: `/assets/js/main.js` (loaded via `<script type="module">`)
- Styles: `/assets/css/base.css`, `/assets/css/components.css`, `/assets/css/motion.css`

All pages reference global resources via absolute paths (`href="/assets/..."`), no build required.

---

## Public Interface

### Language Switching API
- **Path Convention**: `/en/<path>` ↔ `/zh/<path>` mirror
- **Language Detection**: Identified by `i18n.js`'s `detectCurrentLanguage(pathname)`
- **Switch Logic**: Clicking Header language toggle (`<button class="lang-toggle">`) triggers `inferTargetPath` navigation

### Navigation Structure
```html
<nav class="nav-links" aria-label="Primary navigation">
  <a href="/en/about/">About</a>
  <a href="/en/projects/">Projects</a>
  <a href="/en/publications/">Publications</a>
  <a href="/en/contact/">Contact</a>
</nav>
```
Current page link must have `aria-current="page"`.

---

## Key Dependencies & Configuration

### Global CSS Variables (`/assets/css/base.css`)
```css
--color-primary: #38bdf8;      /* Primary color */
--color-bg: #0f172a;            /* Dark blue background */
--color-text: #f1f5f9;          /* Light text */
--radius-lg: 20px;              /* Card border radius */
--shadow-md: 0 20px 45px ...;   /* Shadow */
```

### JavaScript Modules
- `main.js`: Initializes header compression, back-to-top, language toggle, year, email protection, BibTeX copy
- `i18n.js`: Language switching logic (localStorage preference, auto-redirect to mirror path)
- `email.js`: Email obfuscation (desktop hover/click reveals secondary email)
- `copy.js`: BibTeX copy with Toast feedback

---

## Data Models

### Project Card Structure
```html
<article class="card">
  <div class="card-header">
    <h3><a href="/en/projects/<slug>/">Project Title</a></h3>
    <div class="badge-row">
      <span class="badge">Tech Tag</span>
      <span class="badge">Year</span>
    </div>
  </div>
  <p>2-3 line project summary</p>
  <div class="meta-row">
    <a class="icon-button" href="..." aria-label="View GitHub">...</a>
    <a class="icon-button" href="..." aria-label="View Report">...</a>
  </div>
</article>
```

### Project Detail Page Structure (Fixed Order)
1. **Hero**: Project title + tagline
2. **Problem**: Background & challenges
3. **Approach**: Technical solution + architecture diagram (SVG placeholder)
4. **Results**: Data table or key metrics
5. **Role**: Personal contributions list
6. **Links**: GitHub/Report/Demo links

**Verified Structure Consistency**:
- `hybrid-precision`: Mixed-precision training (complete 6-section structure)
- `coral-rag-qa`: CORAL pipeline (complete 6-section structure, Results include response time & accuracy comparison table)
- `ai-customer-service`: Service automation (complete 6-section structure, Results include coverage & CSAT comparison table)

### Publication Entry Structure
```html
<article class="card">
  <h3>Paper Title</h3>
  <p><strong>Qi Jingxuan</strong>, Co-author1, Co-author2</p>
  <p>Venue · Year</p>
  <div class="publication-actions">
    <a class="btn secondary" href="..." target="_blank">DOI/ArXiv</a>
    <button class="btn" type="button" data-bibtex="@article{...}">Copy BibTeX</button>
  </div>
</article>
```
Note: **Author name must be bolded** (`<strong>Qi Jingxuan</strong>`).

---

## Testing & Quality

### Manual Test Checklist
- [ ] **Navigation Highlight**: Current page link has `aria-current="page"`
- [ ] **Language Switching**: From `/en/about/` switch to ZH redirects to `/zh/about/`
- [ ] **Email Obfuscation**: Contact page desktop hover/click reveals secondary email, mobile shows both
- [ ] **BibTeX Copy**: Publications page copy button shows "Copied" toast
- [ ] **Card Hover**: Project cards lift 4px on hover with deeper shadow
- [ ] **Back to Top**: Button appears after scrolling > 600px, smooth scroll on click

### Accessibility
- All icon buttons have `aria-label`
- SVG illustrations have `role="img"` with descriptive `aria-label`
- Tables have `<thead>` and `<th scope="col">`
- Focus ring is visible (`:focus-visible`)

---

## FAQ

### Q1: How to add a new project?
1. Create `projects/<slug>/index.html` (copy `hybrid-precision/index.html` structure)
2. Update project list page `projects/index.html` with new card
3. Sync Chinese version `/zh/projects/<slug>/index.html` and `/zh/projects/index.html`
4. Optional: Update home page "Featured Projects" section

### Q2: How to modify Hero copy on home page?
Edit `en/index.html`'s `<section class="hero">` section, sync with Chinese version at `/zh/index.html`.

### Q3: How to sort publications?
By publication type (Journal > Conference > Preprint) and descending year, each type in separate `<section>`.

---

## Related Files

- **Content Pages**:
  - `en/index.html` (Home)
  - `en/about/index.html` (About)
  - `en/projects/index.html` (Project List)
  - `en/projects/hybrid-precision/index.html` (Mixed-Precision Training)
  - `en/projects/coral-rag-qa/index.html` (Retrieval-Augmented QA)
  - `en/projects/ai-customer-service/index.html` (AI Customer Service Automation)
  - `en/publications/index.html` (Publications)
  - `en/contact/index.html` (Contact)
- **Global Resources**: `/assets/css/`, `/assets/js/`, `/icons/favicon.svg`
- **Chinese Mirror**: Corresponding files under `/zh/`

---

## Next Steps

1. **SEO Optimization**: Verify `<title>` and `<meta name="description">` for each page
2. **Structured Data**: Add `<script type="application/ld+json">` (schema.org/Person) in `about/index.html`
3. **Multilingual SEO**: Add `<link rel="alternate" hreflang="en" href="...">` and `hreflang="zh-Hans"` tags
