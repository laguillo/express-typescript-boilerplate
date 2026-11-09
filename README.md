# Express TypeScript Boilerplate

🚀 Modern Express.js boilerplate with TypeScript, powered by Bun.js for optimal performance and developer experience.

## 📋 Overview

This is a production-ready Express.js boilerplate that leverages the power of TypeScript and Bun.js runtime. It provides a solid foundation for building scalable web APIs with modern development tools and best practices.

## ✨ Features

- ⚡ **Bun.js Runtime** - Ultra-fast JavaScript runtime and package manager
- 📘 **TypeScript** - Type-safe development with strict configuration
- 🛠️ **ESLint & Prettier** - Consistent code formatting and linting
- 🛡️ **Helmet** - Secure HTTP headers by default
- 🌐 **CORS Support** - Configurable allow-list through `CORS_ORIGIN`
- 🚧 **Error Handling** - JSON 404 and error responses, async errors forwarded to the handler
- 📝 **Environment Variables** - `.env` loaded natively by Bun, with validated configuration
- 🧪 **Tests** - `bun test` with example tests for the API
- 🤖 **CI** - GitHub Actions workflow running lint, type check, format check and tests
- 🏗️ **Modular Structure** - Clean separation of concerns
- 📁 **Path Aliases** - `@/*` imports for cleaner code

## 🚀 Quick Start

### Prerequisites

- [Bun.js](https://bun.sh/) installed on your machine

### Installation

```bash
# Clone the repository
git clone https://github.com/laguillo/express-typescript-boilerplate.git
cd express-typescript-boilerplate

# Install dependencies
bun install

# Create your local environment file
cp .env.example .env

# Start development server
bun run dev
```

Your API will be running at `http://localhost:3000`

## 📜 Available Scripts

| Script                 | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `bun run dev`          | Start development server with hot reload                  |
| `bun run start`        | Start production server                                   |
| `bun run lint`         | Run ESLint to check code quality                          |
| `bun run lint:fix`     | Run ESLint and fix what it can                            |
| `bun run typecheck`    | Type-check the project with `tsc` (no files are emitted)  |
| `bun run format`       | Format all files with Prettier                            |
| `bun run format:check` | Check formatting without changing files                   |
| `bun run test`         | Run the test suite with `bun test`                        |
| `bun run check`        | Run lint, type check, format check and tests (same as CI) |

## 📁 Project Structure

```
express-typescript-boilerplate/
├── .github/workflows/ci.yml  # CI: lint, type check, format check, tests
├── src/
│   ├── config/              # Environment parsing and CORS configuration
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Express middlewares (404 and error handling)
│   ├── routes/              # API routes
│   ├── schemas/             # Validation schemas (empty placeholder)
│   ├── app.ts               # Express app configuration
│   ├── app.test.ts          # API tests
│   └── index.ts             # Application entry point (starts the server)
├── .env.example             # Template for the local .env file
├── .gitignore               # Git ignore file
├── .prettierignore          # Files skipped by Prettier
├── .prettierrc              # Prettier configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── bun.lock                 # Bun lock file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and adjust the values. Bun loads `.env` automatically (also
`.env.local` and, under `bun test`, `.env.test`), so no extra package is needed. Variables already
set in the shell take precedence over the files.

| Variable      | Default | Description                                                                                    |
| ------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `PORT`        | `3000`  | Port the server listens on. The server refuses to start if it is not a valid port number.      |
| `CORS_ORIGIN` | _empty_ | Comma-separated list of allowed origins. If empty, any origin is allowed, without credentials. |

### TypeScript Configuration

The project uses a modern TypeScript configuration for Bun.js. Bun runs the `.ts` files directly,
so `tsc` is only used for type checking (`noEmit`):

- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled, plus `noUncheckedIndexedAccess` and `verbatimModuleSyntax`
- Types: `bun` and `node`
- Path aliases: `@/*` → `./src/*`

### ESLint Configuration

ESLint is configured with:

- ESLint recommended rules and the `@typescript-eslint` recommended rules
- Modern flat config format
- `no-undef` disabled for TypeScript files (the compiler already checks it)

## 📦 Dependencies

### Core Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Secure HTTP headers

### Development Dependencies

- **@types/express**, **@types/cors**, **@types/node**, **@types/bun** - TypeScript types
- **typescript** - Type checking (kept on `~6.0` because `@typescript-eslint` does not support 6.1+ yet)
- **eslint**, **@eslint/js**, **@typescript-eslint/eslint-plugin**, **@typescript-eslint/parser** - Code linting
- **prettier** - Code formatting

## 🛠️ Development Workflow

1. **Code Changes**: Make your changes in the `src/` directory
2. **Hot Reload**: Bun automatically restarts the server on file changes
3. **Checks**: Run `bun run check` before committing changes (it runs the same steps as CI)
4. **Formatting**: Prettier formats code with semicolons, single quotes and trailing commas

### Writing routes

Express 5 forwards rejected promises to the error handler, but only if the route handler **returns**
the promise. Return the controller call directly and do not wrap it with `void`:

```ts
router.get('/users', (req, res) => Controllers.usersController(req, res));
```

## 🐛 API Endpoints

Default endpoints available:

- `GET /api/ping` - Health check endpoint
- `GET /api/sample` - Sample route

Unknown routes and errors respond with JSON: `{ "error": "Not Found", "message": "..." }`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Repository

- **GitHub**: https://github.com/laguillo/express-typescript-boilerplate
- **Bun.js**: https://bun.sh/
- **Express.js**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/

---

Built with ❤️ using [Bun.js](https://bun.sh/) for lightning-fast development!
