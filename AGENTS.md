# AGENTS.md

## Cursor Cloud specific instructions

This repo is **Dante** — Ted Goas's personal site/blog (www.tedgoas.com). It is a single
static site built with **Eleventy (11ty)** + **Tailwind CSS** + **PostCSS**. There is no
backend, database, API, or automated test suite. "Running the app" means building the static
site and/or serving it locally.

### Runtime
- `.nvmrc` pins Node 14, but the code builds and runs cleanly on the VM's default Node 22.
  No version switch is needed.
- `package-lock.json` is gitignored, so `npm install` resolves against the `^` ranges in
  `package.json`.

### Commands (defined in `package.json`)
- Dev server (live reload): `npm start` — serves on `http://localhost:8080` (Browsersync UI on
  `http://localhost:3001`). Runs Eleventy `--serve` and PostCSS `--watch` in parallel.
- Production build: `npm run build` — outputs to `dist/`.
- No lint step and no tests exist in this repo.

### Non-obvious notes
- CSS is compiled by the standalone PostCSS command (`postcss:watch` / `postcss`), NOT by
  Eleventy. `dist/assets/css/styles.css` only exists after that step runs, so a bare
  `eleventy --serve` alone will not produce styles — always use the npm scripts (`npm start` /
  `npm run build`) which run both.
- `dist/` is fully regenerated on every run (`clean` runs first), so never edit files in `dist/`.
- Content lives in `src/`: blog posts in `src/posts/`, portfolio in `src/work/`, site config/data
  in `src/_data/`. Adding a Markdown file there is picked up automatically by live reload.
