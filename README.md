# Darshan Jogani — Academic Portfolio

Hi-fi React + Three.js portfolio for **Darshan Jogani**, doctoral researcher at the German Aerospace Center (DLR Stuttgart).

> Alkaline water electrolysis · Power-to-X · Techno-Economic Analysis · Model Predictive Control

---

## What's inside

```
darshan-portfolio/
├── .github/workflows/deploy.yml   ← GitHub Pages auto-deploy
├── public/
│   ├── favicon.svg
│   └── (drop Darshan-Jogani-CV.pdf here)
├── src/
│   ├── main.jsx                   ← Vite entry
│   ├── App.jsx                    ← section composition
│   ├── styles/
│   │   ├── tokens.css             ← colors, fonts, spacing — edit here for theme
│   │   └── globals.css            ← layout, components, utilities
│   ├── data/                      ← editable content
│   │   ├── publications.js        ← papers + abstracts + BibTeX
│   │   ├── talks.js               ← timeline of conferences/seminars
│   │   └── skills.js              ← skills + research pillars
│   ├── lib/                       ← models & utilities
│   │   ├── electrolyzer-model.js  ← Butler-Volmer / polarization math
│   │   ├── mpc-model.js           ← receding-horizon controller
│   │   ├── tea-model.js           ← LCOH waterfall calc
│   │   └── theme.js               ← theme + tweaks context
│   ├── components/                ← chrome (nav, footer, panels…)
│   └── sections/                  ← one file per scrollable section
│       ├── Hero.jsx               ← 3D water molecule + bubbles
│       ├── About.jsx              ← bio + animated stats + skills
│       ├── Research.jsx           ← 3 pillars + floating equation cards
│       ├── ElectrolyzerModel.jsx  ← 3D cell-stack cutaway with hotspots
│       ├── PolarizationCurve.jsx  ← interactive j–U curve
│       ├── MPCDemo.jsx            ← live MPC with retunable Q/R/N
│       ├── TEA.jsx                ← LCOH waterfall + sliders
│       ├── PowerToX.jsx           ← animated process flowsheet
│       ├── Renewables.jsx         ← 24-h renewable→AWE simulation
│       ├── CodeShowcase.jsx       ← Python / MATLAB snippets
│       ├── Publications.jsx       ← search + filter + BibTeX export
│       ├── Talks.jsx              ← speaking timeline
│       └── Contact.jsx            ← form + socials
├── index.html                     ← Vite HTML
├── preview.html                   ← in-browser preview (no build step)
├── vite.config.js
├── package.json
├── README.md                      ← this file
└── DEPLOY.md                      ← deployment cheat-sheet
```

---

## Two ways to run

### 1. Vite dev server (recommended for editing)

```bash
npm install
npm run dev          # → http://localhost:5173
```

Build for production:

```bash
npm run build        # outputs to /dist
npm run preview      # local sanity check of the built bundle
```

### 2. Zero-build preview

`preview.html` loads the **same** `src/` files via an `<importmap>` + Babel-standalone. Useful if you want to demo without a Node.js install.

> Caveat: needs to be served (not opened as `file://`). The simplest:
> ```bash
> npx serve .
> # or
> python3 -m http.server 8080
> ```

---

## Editing common things

| You want to… | Edit |
|---|---|
| Change brand colors | `src/styles/tokens.css` (`--teal`, `--indigo`) |
| Add a publication | `src/data/publications.js` (auto-appears in list & search) |
| Add a talk | `src/data/talks.js` |
| Add a skill chip | `src/data/skills.js` |
| Tune the polarization model | `src/lib/electrolyzer-model.js` |
| Adjust LCOH defaults | `src/lib/tea-model.js` |
| Add a new section | New file in `src/sections/`, import into `src/App.jsx` |
| Replace placeholder CV | Drop `Darshan-Jogani-CV.pdf` into `public/` |

---

## Live tweaks (in the running site)

The toolbar Tweaks button opens a panel that lets visitors recolor the site live (accent, accent-2, dark background, plus 5 presets). The state persists in `localStorage`. There's also a one-click theme toggle (dark/light).

---

## Deployment

See **`DEPLOY.md`** for full instructions. Two paths:

- **Auto** — push to `main`; the GitHub Actions workflow builds and publishes to Pages.
- **Manual** — `npm run build` and push the `dist/` folder yourself.

---

## Tech

- **Vite 5** + **React 18** — build & framework
- **@react-three/fiber + drei + three.js** — 3D scenes (water molecule, cell stack)
- **GSAP + ScrollTrigger** — entrance + scroll-linked animation
- **KaTeX** — equation rendering
- **No CSS framework** — hand-rolled tokens for full editorial control

---

## Credits

Designed and engineered for **Darshan Jogani** — doctoral researcher, DLR Institute of Engineering Thermodynamics, Stuttgart. Crafted with care.
