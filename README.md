# Ali Nebi Dal — Portfolio

Personal site: a full-bleed video hero with an animated arrow, plus Ventures and Contact sections.

**Live:** https://alinebidal10-afk.github.io/portfolio/

## Run it

```bash
git clone https://github.com/alinebidal10-afk/portfolio.git
cd portfolio
npm install
npm run dev
```

Open **http://localhost:3000** — that's it. Requires Node.js 20+.

## Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at localhost:3000 with hot reload |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build` | Static export for GitHub Pages (output in `.next-export/`) |

## Project layout

```
app/                     App Router pages + global styles
components/hero/         Full-bleed video hero (arrow, glow, constants)
components/site-nav.tsx  Fixed top navigation
components/*-section.tsx Ventures + Contact sections
public/hero/             hero.mp4 (1112x834) + poster.jpg
```

## Tuning the hero

Every knob lives in `components/hero/hero.constants.ts` — figure position,
arrow route/timings, colors are CSS variables in `app/globals.css`.

To recalibrate where the figure is in the video: run the dev server, open
`http://localhost:3000/?calibrate=1`, click on the figure, and paste the
copied `FIGURE` constant into `hero.constants.ts`.

## Deploy

The site is served by GitHub Pages from the `gh-pages` branch:

```bash
rm -rf .next-export
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
cd .next-export
touch .nojekyll
git init -b gh-pages && git add -A && git commit -m "Deploy"
git push -f https://github.com/alinebidal10-afk/portfolio.git gh-pages
rm -rf .git
```

Built with Next.js 16, TypeScript, and Tailwind CSS v4.
