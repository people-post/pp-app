# AGENTS.md

## Cursor Cloud specific instructions

This is a **frontend-only** TypeScript SPA (People Post). There is no backend in this repository.

### Quick reference

- **Install**: `npm install`
- **Build** (web2 + web3): `npm run build`
- **Build web2 only**: `npm run build:2`
- **Build web3 only**: `npm run build:3`
- **Type-check**: `npm run type-check`
- **Clean**: `npm run clean`

See `README.md` for full build documentation.

### Non-obvious caveats

- **For code changes, always run `npm run build` before finishing.** This is the primary verification step in this repo.
- **No lint command exists.** `npm run type-check` (`tsc --noEmit`) is the closest equivalent. It currently reports many errors because the codebase is mid-migration from JS to TS; these are expected and do not block the esbuild-based build.
- **No automated tests.** `npm test` is a placeholder that exits with code 1. There is no test framework configured.
- **Web3 build is self-contained** (`dist/web3/index.html`), while web2 produces only JS/CSS bundles (`dist/web2/static/`) meant to be served by the separate People Post backend.
- **The `pp-api` dependency** is installed from GitHub (`github:people-post/pp-api#release/v0.1.8`). Its postinstall step builds from source when `dist/` is missing. This can occasionally be slow on first `npm install`.
- **Serving the web3 build locally** (e.g. `python3 -m http.server 8080` from `dist/web3/`) will load the page but the app cannot fully initialize without backend P2P infrastructure (resolvers, publishers, IPFS storage). Console errors about "Server PeerID is required" and WebSocket failures are expected in this environment.
