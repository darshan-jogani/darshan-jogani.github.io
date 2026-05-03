# Darshan Jogani — Academic Portfolio

Hi-fi React + Three.js portfolio for Darshan Jogani — Doctoral Researcher, DLR Stuttgart.

This repository contains a polished personal portfolio built with Vite, React and Three.js. It includes interactive visualizations, a live 3D hero, code snippets, publications, talks, and a contact form.

Why this repo exists

- Showcase research and code (AEL modelling, MPC demos, TEA calculations)
- Provide a compact, editable portfolio scaffold for academic CVs and project pages

Quick tree (high-level)

```
portfolio/
├── public/                 # static public assets (favicon, CV PDF)
├── src/
│   ├── main.jsx            # app entry
│   ├── App.jsx             # section composition & layout
│   ├── styles/             # tokens.css (theme), globals.css (layout)
│   ├── lib/                # models + theme context
│   ├── components/         # UI chrome: Nav, Footer, Reveal, ThemeToggle
│   └── sections/           # page sections (Hero, About, CodeShowcase, Contact...)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Table of contents

- Getting started (dev)
- Building & deployment
- Theme & tweaks (how theming works)
- Troubleshooting (common issues & fixes)
- Development notes (how to edit sections / change fonts)
- Contributing & license

Getting started (recommended)

Prerequisites

- Node.js (16+) and npm (or pnpm/yarn)

Install and run dev server (PowerShell):

```powershell
npm install
npm run dev
# open http://localhost:5173
```

Build & preview production bundle

```powershell
npm run build
npm run preview
# or serve the dist folder with a static server
```


Editing the site

- Colors / tokens: `src/styles/tokens.css` — where CSS custom properties live (accent, bg, fg, spacing)
- Global CSS: `src/styles/globals.css`
- Sections: `src/sections/*.jsx` — each scrollable section lives in its own file. To add a section, create the file and import it in `src/App.jsx`.
- Theme handling: `src/lib/theme.jsx` (context + localStorage persistence)

Deployment

1. GitHub Actions (auto) — The repository contains a GitHub Actions workflow that builds the site and publishes to GitHub Pages when you push to `main`. Check `.github/workflows/deploy.yml` for details.
2. Manual (one-off)

```powershell
npm run build
# Preview locally
npm run preview
# Copy / upload the generated `dist/` to your chosen host (Netlify, Surge, S3, GitHub Pages)
```

If you prefer GitHub Pages but not Actions, a quick manual publish is to push the `dist/` tree to the `gh-pages` branch (tools such as `gh-pages` can automate this).

Theme & runtime tweaks (important)

- The app uses CSS custom properties (tokens) to support dark/light themes and live tweaks. The `ThemeToggle` and `TweaksPanel` write to `document.documentElement` and persist preferences in `localStorage`.
- If you see theme values not updating when toggling (e.g., sections appear stuck in dark mode until a full refresh), that usually means inline CSS variables set by JS are overriding stylesheet declarations. Ensure any code that sets `root.style.setProperty('--var', ...)` cleans up or sets values symmetrically when switching themes (see `src/lib/theme.jsx`).
- For three.js materials that depend on CSS variables, some components use MutationObservers to re-sync colors when the theme changes. If you add custom scenes, either re-read CSS variables on theme change or observe `document.documentElement` for style/data-theme changes.

Troubleshooting (common issues)

- Text barely visible after theme toggle: check for ad-hoc `!important` overrides in section styles (revert them) and prefer fixing token values in `tokens.css` or setting/removing inline variables symmetrically in `theme.jsx`.
- Vite deprecation warnings: If you see warnings about `esbuild` and `rollupOptions`, consider switching to `@vitejs/plugin-react-oxc` as recommended by Vite.
- 3D not updating colors: ensure materials read updated colors (MutationObserver or re-create materials when theme changes).

Design & accessibility notes

- Colors, spacing and typographic scale are defined in `tokens.css` — keep contrast checks in mind when customizing to maintain WCAG compliance.
- Headings and interactive controls use semantic HTML to preserve keyboard navigation and screen reader friendliness.

Developer tips

- Quick grep to find places that write CSS variables:

```powershell
Select-String -Path src\**\*.jsx -Pattern "setProperty\('--" -SimpleMatch
```

- To change the code font used in `CodeShowcase`, edit `src/sections/CodeShowcase.jsx` — a ligature-friendly font (JetBrains Mono, Cascadia Code, Fira Code) is already included as an option.

Contributing

- Small fixes and content updates are welcome. For code changes, open a PR against `main` with a short description. For big features, open an issue first to discuss the design.

License

- This project is licensed under the BSD 3-Clause "New" ("Revised") License. See the `LICENSE` file in the repository root for full terms.

Contact

- The contact section on the live site provides an email and socials. For repo questions, you can open an issue.

Extras I added while auditing the project

- A dynamic weekday/holiday status badge was added to `src/sections/Contact.jsx` (shows green "Responsive" on weekdays, red "Away / Public holiday" otherwise).
- A small fix was suggested for `src/lib/theme.jsx` to avoid leaving inline CSS custom properties set only for dark theme (this can cause theme toggles to look broken until a refresh). If you'd like, I can apply that patch for you.

Enjoy — and if you'd like I can also:

- Add a tiny CI test that builds the site on PRs
- Add an automated holiday calendar lookup (so the contact badge uses an authoritative list)
- Convert `tokens.css` into a light/dark JSON and generate CSS variables automatically
