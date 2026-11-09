# Express TypeScript Boilerplate

[![CI](https://github.com/laguillo/express-typescript-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/laguillo/express-typescript-boilerplate/actions/workflows/ci.yml)

🚀 A small Express 5 + TypeScript starter that runs on [Bun](https://bun.sh/): the `.ts` files run directly, with no build step.

## ✨ What's included

- ⚡ **Bun runtime** - run, watch, test and install with a single tool
- 📘 **Strict TypeScript** - `tsc` is only used for type checking (`noEmit`)
- 🛡️ **Helmet** - secure HTTP headers by default
- 🌐 **CORS** - configurable allow-list through `CORS_ORIGIN`
- 🚧 **Error handling** - JSON 404 and error responses; errors thrown in async handlers reach the error handler
- 📝 **Validated configuration** - `PORT` and `CORS_ORIGIN` are parsed in one place, and an invalid `PORT` stops the server from starting
- 🔌 **Graceful shutdown** - the server closes cleanly on `SIGTERM` and `SIGINT`
- 🧪 **Tests** - `bun test` with example API tests
- 🛠️ **ESLint & Prettier** - linting and formatting, checked by CI
- 📁 **Path alias** - `@/*` maps to `src/*`

**Not included:** database, authentication, a request validation library and structured logging. `src/schemas/` is an empty placeholder for your validation schemas.

## 🚀 Quick start

You need [Bun](https://bun.sh/). The version used in CI is pinned in `package.json` (`packageManager`).

```bash
git clone https://github.com/laguillo/express-typescript-boilerplate.git my-api
cd my-api

bun install
cp .env.example .env
bun run dev
```

The API runs at `http://localhost:3000`. If you are starting a new project from this one, also update `name`, `description` and `author` in `package.json`.

## 📜 Scripts

| Script              | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `bun run dev`       | Start the development server with hot reload              |
| `bun run start`     | Start the server without watching for changes             |
| `bun run lint`      | Run ESLint (`lint:fix` also fixes what it can)            |
| `bun run typecheck` | Type-check the project with `tsc`                         |
| `bun run format`    | Format all files with Prettier (`format:check` verifies)  |
| `bun run test`      | Run the tests with `bun test`                             |
| `bun run check`     | Run lint, type check, format check and tests (same as CI) |

Run a single test file with `bun test src/app.test.ts`, or filter by name with `bun test -t "<name>"`.

## 🧩 Adding an endpoint

Controllers are methods of a single `ControllerClass` instance, and routes call them through it. Adding `GET /api/hello` takes four small changes plus a test.

**1. Write the handler** in `src/controllers/hello.ts`:

```ts
import type { Request, Response } from 'express';
import type { ControllerClass } from '@/controllers/index';

export async function HelloController(
    this: ControllerClass,
    req: Request,
    res: Response
): Promise<void> {
    res.status(200).json({ message: 'Hello!' });
}
```

**2. Register it** in `src/controllers/index.ts`, next to the other controllers:

```ts
import { HelloController } from '@/controllers/hello';

export class ControllerClass {
    // ...
    helloController = HelloController;
}
```

**3. Create the route** in `src/routes/hello.ts`:

```ts
import { Router } from 'express';
import Controllers from '@/controllers/index';

export const helloRoute = Router();

helloRoute.get('/hello', (req, res) => Controllers.helloController(req, res));
```

**4. Mount it** in `src/routes/index.ts` with `router.use(helloRoute);`.

Then add a test next to the existing ones in `src/app.test.ts` and run `bun run check`.

> **Two rules for route handlers**
>
> - **Return the controller's promise.** Express 5 sends rejected promises to the error handler only if the handler returns them. Writing `void Controllers.x(req, res)` leaves the request hanging when the controller throws.
> - **Call controllers through `Controllers`** (as above), not as detached functions, so `this` stays bound to the `ControllerClass` instance.

## 🔧 Configuration

Copy `.env.example` to `.env` and adjust the values. Bun loads `.env` automatically (also `.env.local` and, under `bun test`, `.env.test`), so no extra package is needed. Variables already set in the shell take precedence over the files.

| Variable      | Default | Description                                                                                    |
| ------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `PORT`        | `3000`  | Port the server listens on. The server refuses to start if it is not a valid port number.      |
| `CORS_ORIGIN` | _empty_ | Comma-separated list of allowed origins. If empty, any origin is allowed, without credentials. |

When `CORS_ORIGIN` is set, only those origins are accepted and credentials are enabled for them.

New variables are parsed and validated in `src/config/env.ts`; document them in `.env.example` too.

## 🐛 API

| Method | Path          | Response                                        |
| ------ | ------------- | ----------------------------------------------- |
| `GET`  | `/api/ping`   | `200` `{ "message": "Server running" }`         |
| `GET`  | `/api/sample` | `200` `{ "message": "This is a sample route" }` |

Unknown routes and errors respond with JSON, never HTML:

```bash
$ curl -i http://localhost:3000/api/nope
HTTP/1.1 404 Not Found
{"error":"Not Found","message":"Cannot GET /api/nope"}
```

Client errors (4xx) include the reason in `message`. Server errors (5xx) are logged with `console.error` and respond with a generic `Internal Server Error`, so details are never leaked.

## 📁 Project structure

```
src/
├── config/        # Environment parsing and CORS options
├── controllers/   # Handlers, aggregated in ControllerClass
├── middlewares/   # 404 and error handlers
├── routes/        # Routers, mounted under /api
├── schemas/       # Validation schemas (empty placeholder)
├── app.ts         # Builds the Express app (does not listen)
└── index.ts       # Starts the server
```

`.github/workflows/ci.yml` runs install (with `--frozen-lockfile`), lint, type check, format check and tests on every push to `main` and on pull requests.

## 🛠️ Tooling notes

- **TypeScript**: strict mode plus `noUncheckedIndexedAccess` and `verbatimModuleSyntax` (type-only imports need `import type`). The `types` option includes both `bun` and `node`. Check the peer range of `@typescript-eslint` before bumping `typescript`.
- **ESLint**: flat config with the recommended ESLint and `@typescript-eslint` rules. `no-undef` is off for TypeScript files because the compiler already checks it.
- **Prettier**: 4 spaces, single quotes, semicolons and a 100-character line width (see `.prettierrc`).
- **Dependencies**: after changing them, run `bun install` and commit `bun.lock`; CI fails if the lockfile is out of sync.

## 🤝 Contributing

1. Fork the repository and create a feature branch
2. Make your changes
3. Run `bun run check`
4. Open a pull request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
