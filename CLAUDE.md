# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Bun is the runtime and package manager (`packageManager` pins the version). There is no build step: Bun runs the `.ts` files directly, and `tsc` is only used for type checking (`noEmit`).

```bash
bun run dev            # bun --watch src/index.ts
bun run start          # bun src/index.ts
bun run check          # lint + typecheck + format:check + test (same steps as CI)
bun run lint           # eslint .   (lint:fix to autofix)
bun run typecheck      # tsc --noEmit
bun run format         # prettier --write .   (format:check to verify only)
bun test               # all tests
bun test src/app.test.ts          # a single file
bun test -t "hanging the request" # tests whose name matches a pattern
```

CI (`.github/workflows/ci.yml`) runs `bun install --frozen-lockfile`, so `package.json` and `bun.lock` must stay in sync: run `bun install` (or `bun add`) after changing dependencies and commit the lock.

## Architecture

Request flow: `src/index.ts` (starts the server, graceful shutdown) → `src/app.ts` (middleware chain) → `src/routes/` mounted under `/api` → `src/controllers/`.

- **`src/app.ts` is the only place that assembles the app and exports it without listening.** Tests import `app` and call `listen(0)` themselves; keep `listen` in `index.ts`. Middleware order matters: `helmet`, `cors`, body parsers, `/api` router, then `notFoundHandler`, then `errorHandler` last.
- **Configuration lives in `src/config/env.ts`** (parses `PORT` and `CORS_ORIGIN`, throws on an invalid `PORT`). There is no dotenv: Bun loads `.env`, `.env.local` and (under `bun test`) `.env.test` before running any code, and variables already set in the shell win. `.env.example` is only a template and is never loaded. New env vars go in `env.ts` and `.env.example`. If the project ever moves to Node, loading would need `--env-file` or a package again.
- **Controllers use a class aggregator.** `ControllerClass` in `src/controllers/index.ts` is instantiated once and exported as the default `Controllers`; handlers from other files are attached as properties (`sampleController = SampleController`) and typed with `this: ControllerClass`. Routes must call them as `Controllers.x(req, res)` so `this` is preserved. Do not pass them unbound.
- **`src/schemas/` is an empty placeholder** for validation schemas; no validation library is installed yet.

## Gotchas

- **Route handlers must return the controller's promise**: `(req, res) => Controllers.x(req, res)`. Express 5 forwards rejections to the error handler only if the promise is returned. Wrapping it as `void Controllers.x(...)` leaves the request hanging and raises an `unhandledRejection` (a regression test in `src/app.test.ts` covers this). For the types to line up, controllers are `async ...: Promise<void>` and call `res.status().json()` without `return`.
- **`errorHandler` must keep all 4 parameters** (including the unused-looking `next`); Express identifies error handlers by arity. It logs only 5xx and never exposes the message of a 5xx.
- **CORS semantics** (`src/config/cors.ts`): without `CORS_ORIGIN` it allows any origin and no credentials; with a list it restricts to it and enables credentials. Never combine `*` with `credentials: true`.
- **TypeScript is pinned to `~6.0.3`** because `@typescript-eslint` declares a peer range of `<6.1.0`. Check that peer range before bumping.
- **`tsconfig` `types` needs both `"bun"` and `"node"`.** With only `bun`, `process.on('SIGTERM', ...)` resolves to Bun's `memoryPressure` overload and fails to type-check. `@types/node` is kept on the major Bun emulates (`bun -p process.version`).
- **`@/*` resolves to `src/*`** through `tsconfig` `paths`; Bun, `bun test` and `tsc` all honor it, so no extra config is needed. `verbatimModuleSyntax` is on: type-only imports must use `import type`.
- **ESLint** (flat config, `eslint.config.js`) disables `no-undef` for TypeScript files via the plugin's `flat/recommended`; do not re-enable it or globals such as `setTimeout`/`URL` will be flagged.
- **Prettier** uses 4 spaces, single quotes and `printWidth` 100 (`.prettierrc`), and CI fails on `format:check`.
- **Tests** use `bun:test` (`describe`/`test`/`expect`/`spyOn`), live next to the code as `*.test.ts`, start a real server on port 0 and call it with `fetch`. To simulate a failing controller, spy on the `Controllers` singleton (`spyOn(Controllers, 'pingController')`) and silence `console.error` while doing so.
