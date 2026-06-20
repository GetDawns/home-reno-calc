# Portfolio — Bayron Peguero

A self-contained static portfolio site. No build step, no dependencies.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd portfolio
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Files

- `index.html` — markup and content
- `styles.css` — all styling (editorial / typographic theme)
- `main.js` — scroll-reveal animations, footer year

## Deploy

Drop the `portfolio/` folder onto any static host — GitHub Pages, Netlify,
Vercel, Cloudflare Pages. No configuration required.

## Editing content

All copy lives directly in `index.html`. Projects are list items under
`<ol class="projects">`; skills under `<section id="skills">`. Colors and
fonts are CSS variables at the top of `styles.css`.
