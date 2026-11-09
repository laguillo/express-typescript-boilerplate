import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    spyOn,
    test,
} from 'bun:test';
import express from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import app from '@/app';
import Controllers from '@/controllers/index';
import { errorHandler } from '@/middlewares/error-handler';

function listen(application: express.Express): { server: Server; url: string } {
    const server = application.listen(0);
    const { port } = server.address() as AddressInfo;
    return { server, url: `http://localhost:${port}` };
}

describe('API', () => {
    const { server, url } = listen(app);
    afterAll(() => void server.close());

    test('GET /api/ping responds 200', async () => {
        const res = await fetch(`${url}/api/ping`);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: 'Server running' });
    });

    test('GET /api/sample responds 200', async () => {
        const res = await fetch(`${url}/api/sample`);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: 'This is a sample route' });
    });

    test('unknown routes respond with a JSON 404', async () => {
        const res = await fetch(`${url}/api/does-not-exist`);
        expect(res.status).toBe(404);
        expect(res.headers.get('content-type')).toContain('application/json');
        expect(await res.json()).toEqual({
            error: 'Not Found',
            message: 'Cannot GET /api/does-not-exist',
        });
    });

    test('malformed JSON bodies respond with a JSON 400', async () => {
        const res = await fetch(`${url}/api/ping`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{bad',
        });
        expect(res.status).toBe(400);
        expect(res.headers.get('content-type')).toContain('application/json');
        const body = (await res.json()) as { error: string };
        expect(body.error).toBe('Bad Request');
    });

    test('sets security headers and hides X-Powered-By', async () => {
        const res = await fetch(`${url}/api/ping`);
        expect(res.headers.get('x-powered-by')).toBeNull();
        expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    });

    // Regression: wrapping the controller call with `void` in a route drops the promise,
    // so a rejection never reaches the error handler and the request hangs forever.
    test('a controller that rejects yields a 500 instead of hanging the request', async () => {
        const errorSpy = spyOn(console, 'error').mockImplementation(() => {});
        const controllerSpy = spyOn(Controllers, 'pingController').mockRejectedValue(
            new Error('boom')
        );
        try {
            const res = await fetch(`${url}/api/ping`, { signal: AbortSignal.timeout(2000) });
            expect(res.status).toBe(500);
            expect(await res.json()).toEqual({
                error: 'Internal Server Error',
                message: 'Internal Server Error',
            });
        } finally {
            controllerSpy.mockRestore();
            errorSpy.mockRestore();
        }
    });
});

describe('errorHandler', () => {
    let errorSpy: ReturnType<typeof spyOn<Console, 'error'>>;
    beforeEach(() => {
        errorSpy = spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => errorSpy.mockRestore());

    const failing = express();
    // Same shape as the routes: the async handler returns its promise to Express.
    failing.get('/boom', async () => {
        throw new Error('database password is hunter2');
    });
    failing.get('/teapot', () => {
        throw Object.assign(new Error('I am a teapot'), { status: 418 });
    });
    failing.use(errorHandler);

    let server: Server;
    let url: string;
    beforeAll(() => void ({ server, url } = listen(failing)));
    afterAll(() => void server.close());

    test('turns a rejected async handler into a 500 without leaking details', async () => {
        const res = await fetch(`${url}/boom`, { signal: AbortSignal.timeout(2000) });
        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Internal Server Error',
            message: 'Internal Server Error',
        });
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    test('keeps the status and message of client errors, without logging them', async () => {
        const res = await fetch(`${url}/teapot`);
        expect(res.status).toBe(418);
        expect(await res.json()).toEqual({ error: "I'm a Teapot", message: 'I am a teapot' });
        expect(errorSpy).not.toHaveBeenCalled();
    });
});
