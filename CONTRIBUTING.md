# Contributing

Thanks for helping improve dash-seqviz. This is a Dash component library: a
React/JS component in `src/lib/` compiled into the Python package in
`dash_seqviz/` (the built JS + generated Python classes are committed).

## Local development

The project uses a conda/mamba environment (`environment.yml`) plus Node.

```bash
# 1. Environment
mamba env create -f environment.yml
mamba activate dash-seqviz

# 2. JS dependencies
npm install

# 3. Build the component (JS bundle + generated Python classes)
npm run build

# 4. Run the demo app -> http://127.0.0.1:8888
python usage.py
```

Edit the component in `src/lib/components/SeqViz.react.js` (public API +
propTypes) and `src/lib/fragments/SeqViz.react.js` (implementation), then
`npm run build` to regenerate `dash_seqviz/`.

## Tests

```bash
pytest              # unit + browser (selenium) tests
pytest --headless   # headless browser tests (CI mode)
```

Browser tests use `dash.testing` and need Chrome/Chromium; they skip
automatically when no browser is available.

## Python helpers & integrations

`parse()`, `fetch_ncbi()`, `legend()`, and `validate_props()` live in
`dash_seqviz/`. The optional MLflow integration is in
`dash_seqviz/integrations/mlflow.py` (`pip install dash-seqviz[mlflow]`).
Runnable examples are under `examples/`.

## Docs site

The static site in `docs/` is served at <https://dash-seqviz.com> (GitHub
Pages, from `main:/docs`). Preview it locally:

```bash
python -m http.server 8899 --directory docs
```

### PR preview deployments

Each pull request gets a live preview of the `docs/` site on **Cloudflare
Workers** (static assets), via Cloudflare's native Git integration — no repo
workflow or secrets. The [`wrangler.jsonc`](./wrangler.jsonc) at the repo
root configures an assets-only Worker that serves `docs/`; Workers Builds
reads it and deploys on every push.

One-time setup in the Cloudflare dashboard (Workers &amp; Pages → the
`dash-seqviz` project connected to this repo):

1. **Build command: empty.** The site is static — no build step. (Leaving it
   as the repo's `npm run build` would build the Dash *component*, not the
   docs, and fail.)
2. **Deploy command:** `npx wrangler deploy` (the default) — it reads
   `wrangler.jsonc` and uploads `docs/`.
3. Enable **non-production branch builds** so each PR gets its own
   `preview_urls` deployment (posted as a PR comment).

GitHub Pages (`main:/docs`, serving <https://dash-seqviz.com>) is unaffected.

## Releases

Automated with
[release-please](https://github.com/googleapis/release-please): merges to
`main` open/update a release PR; merging that PR tags a release and CI
publishes to PyPI and npm. Do not edit `CHANGELOG.md` by hand.
