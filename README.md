# Express TypeScript Boilerplate

🚀 Modern Express.js boilerplate with TypeScript, powered by Bun.js for optimal performance and developer experience.

## 📋 Overview

This is a production-ready Express.js boilerplate that leverages the power of TypeScript and Bun.js runtime. It provides a solid foundation for building scalable web APIs with modern development tools and best practices.

## ✨ Features

- ⚡ **Bun.js Runtime** - Ultra-fast JavaScript runtime and package manager
- 📘 **TypeScript** - Type-safe development with strict configuration
- 🛠️ **ESLint & Prettier** - Consistent code formatting and linting
- 🌐 **CORS Support** - Cross-origin resource sharing configured
- 📝 **Environment Variables** - dotenv integration for configuration
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

# Start development server
bun run dev
```

Your API will be running at `http://localhost:3000`

## 📜 Available Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `bun run dev`   | Start development server with hot reload      |
| `bun run start` | Start production server                       |
| `bun run lint`  | Run ESLint to check code quality              |
| `bun run test`  | Run tests (placeholder - no tests configured) |

## 📁 Project Structure

```
express-typescript-boilerplate/
├── src/
│   ├── controllers/          # Route controllers
│   ├── routes/              # API routes
│   ├── app.ts              # Express app configuration
│   └── index.ts            # Application entry point
├── .gitignore              # Git ignore file
├── .prettierrc             # Prettier configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── bun.lock               # Bun lock file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
# Add other environment variables as needed
```

### TypeScript Configuration

The project uses modern TypeScript configuration optimized for Bun.js:

- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`

### ESLint Configuration

ESLint is configured with:

- TypeScript support
- Recommended rules for TypeScript
- Modern flat config format
- Globals: `console`, `process`

## 📦 Dependencies

### Core Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Dependencies

- **@types/express** - TypeScript types for Express
- **@types/cors** - TypeScript types for CORS
- **eslint** - Code linting
- **@typescript-eslint/eslint-plugin** - TypeScript ESLint rules
- **prettier** - Code formatting

## 🛠️ Development Workflow

1. **Code Changes**: Make your changes in the `src/` directory
2. **Hot Reload**: Bun automatically restarts the server on file changes
3. **Linting**: Run `bun run lint` before committing changes
4. **Formatting**: Prettier formats code with semicolons and trailing commas

## 🐛 API Endpoints

Default endpoints available:

- `GET /api/ping` - Health check endpoint
- `GET /api/sample` - Sample route

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
