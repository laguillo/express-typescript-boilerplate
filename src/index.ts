import app from '@/app';
import { env } from '@/config/env';

const server = app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
});

function shutdown(signal: string): void {
    console.log(`${signal} received, shutting down...`);

    server.close((err) => process.exit(err ? 1 : 0));
    server.closeIdleConnections();

    // Force exit if open connections do not finish in time.
    setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
