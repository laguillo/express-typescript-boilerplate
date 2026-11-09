// Bun loads `.env` (and `.env.local`, `.env.test`, ...) on its own before running any code,
// including under `bun test`, so there is nothing to load here: only parse and validate.

function parsePort(value: string | undefined, fallback: number): number {
    if (value === undefined || value.trim() === '') return fallback;

    const port = Number(value);
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
        throw new Error(`Invalid PORT "${value}": expected an integer between 0 and 65535`);
    }
    return port;
}

function parseList(value: string | undefined): string[] {
    return (value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

export const env = {
    port: parsePort(process.env.PORT, 3000),
    corsOrigins: parseList(process.env.CORS_ORIGIN),
} as const;
