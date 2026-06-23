# Mystery Vault

A premium, dark-themed mystery blogging website. Cinematic, glassmorphic UI built with plain HTML, CSS, and JavaScript — no build step, no dependencies.

## Structure

```
mystery-vault/
├── index.html   # All markup & SEO meta tags
├── style.css    # Design tokens, layout, responsive rules, animations
├── script.js    # Article data, search, form validation, scroll effects
└── README.md
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy

**Vercel**
```bash
npm i -g vercel
vercel
```
(No config needed — it's a static site.)

**GitHub Pages**
1. Push this folder to a repo.
2. Settings → Pages → Deploy from branch → `main` / root.

## Customizing

- Article data lives in the `articles` array at the top of `script.js`. Add/edit objects there — cards render automatically.
- Color tokens are CSS variables at the top of `style.css` (`:root`), so the entire palette can be retuned from one place.
- Fonts: Cinzel (display), Cormorant Garamond (italic accents), Inter (body) — loaded via Google Fonts in `index.html`.
