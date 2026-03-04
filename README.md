# Kubar Labs Website

The official marketing website for **Kubar Labs** — India's first MSME-focused plug-and-play embedded business-credit hub. This single-page site presents [NavDhan](https://kubar.tech), Kubar's credit intelligence platform for MSME lending.

## What It Is

A deep-tech, single-page marketing site for Kubar Labs, featuring:

- **Hero** — Animated particle network canvas, typed headline effect, awards recognition strip
- **Credit Intelligence** — Four rotating-gradient-border feature cards covering NLP contextualisation, sector-specific lending models, full loan lifecycle management, and alternative data ingestion
- **NavDhan** — Product showcase with floating visual, use-case cards, and integration ecosystem
- **Solutions** — Dual-audience section for Banks & NBFCs and for MSMEs
- **Impact / Stats** — Animated counters, market sizing banner ($300B credit gap)
- **Team** — 7 core team members + 5-person advisory board
- **Resources** — Substack article cards + "Learn with Kubar" section (podcast, newsletter, knowledge base)
- **Contact** — Demo booking form + partner/support/press email links
- **Footer** — Brand, product, company, and social links

## Tech Stack

| Layer | Detail |
|---|---|
| Markup | Semantic HTML5 with ARIA labels throughout |
| Styling | Vanilla CSS — custom properties (design tokens), fluid `clamp()` type scale, CSS Grid & Flexbox, CSS scroll-driven animations with IntersectionObserver fallback |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (display) + [Inter](https://fonts.google.com/specimen/Inter) (body) via Google Fonts |
| Animation | Canvas particle network (hero background), CSS `@keyframes`, scroll-triggered reveal, animated counter |
| JavaScript | Vanilla ES5-compatible IIFE — zero dependencies, zero frameworks |
| Deployment | Static HTML — compatible with Netlify, Vercel, GitHub Pages, or any CDN |

## Running Locally

No build step required. Just open `index.html` in any modern browser:

```bash
# Option 1: open directly
open index.html

# Option 2: serve with Python (avoids any file:// restrictions)
python3 -m http.server 8080
# then visit http://localhost:8080

# Option 3: serve with Node
npx serve .
```

## Project Structure

```
kubar-labs-website/
├── index.html          # Entire site — HTML + CSS + JS in one file
├── assets/
│   ├── hero-bg.jpg           # Hero section background texture
│   ├── navdhan-visual.jpg    # NavDhan product visual (floating shield)
│   └── section-bg-data.jpg  # NavDhan section background texture
├── netlify.toml        # Netlify deployment configuration
├── .gitignore
└── README.md
```

> **Note on images:** The `assets/` folder contains binary JPG files. These need to be uploaded separately (e.g., via the GitHub web UI, `git` CLI, or GitHub Desktop) because the GitHub API used for this initial commit only accepts text-based files. The site will still render — images gracefully degrade — but upload the assets to complete the deployment.

## Deploying to Netlify

### Option A — Netlify UI (recommended)
1. Push this repo to GitHub (already done at [Kubar-Labs/kubar-labs-website](https://github.com/Kubar-Labs/kubar-labs-website))
2. Log in to [app.netlify.com](https://app.netlify.com)
3. Click **Add new site → Import an existing project**
4. Connect your GitHub account and select **Kubar-Labs/kubar-labs-website**
5. Set **Publish directory** to `.` (or leave blank — `netlify.toml` handles it)
6. Click **Deploy site**

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

### Option C — Netlify Drop
Drag and drop the project folder at [app.netlify.com/drop](https://app.netlify.com/drop).

## Deploying to Vercel

```bash
npm install -g vercel
vercel --prod
```

Vercel auto-detects a static site and serves `index.html` from the root.

## Deploying to GitHub Pages

1. Go to **Settings → Pages** in the repo
2. Set source to **Deploy from a branch → main → / (root)**
3. Save — the site will be live at `https://kubar-labs.github.io/kubar-labs-website/`

## Live Site

[https://kubar.tech](https://kubar.tech)

## Contact

- Partner enquiries: [partner@kubar.tech](mailto:partner@kubar.tech)
- Support: [support@kubar.tech](mailto:support@kubar.tech)
- Press: [press@kubar.tech](mailto:press@kubar.tech)
- LinkedIn: [linkedin.com/company/kubar-labs](https://www.linkedin.com/company/kubar-labs/)
- Substack: [kubarlabs.substack.com](https://kubarlabs.substack.com/)

---

© 2025 Kubar Labs. All rights reserved.
