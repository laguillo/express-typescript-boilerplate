import { STATUS_CODES } from 'node:http';
import type { NextFunction, Request, Response } from 'express';

function getStatus(err: unknown): number {
    if (typeof err === 'object' && err !== null) {
        // body-parser and http-errors set `status` / `statusCode` on the errors they create.
        const { status, statusCode } = err as { status?: unknown; statusCode?: unknown };
        const code = typeof status === 'number' ? status : statusCode;
        if (typeof code === 'number' && code >= 400 && code <= 599) return code;
    }
    return 500;
}

// Express recognizes error handlers by their 4 parameters: do not remove `next`.
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
        next(err);
        return;
    }

    const status = getStatus(err);
    if (status >= 500) console.error(err);

    // Client errors (4xx) are safe to describe; never leak details of server errors.
    const message = status < 500 && err instanceof Error ? err.message : 'Internal Server Error';
    res.status(status).json({ error: STATUS_CODES[status] ?? 'Error', message });
}
