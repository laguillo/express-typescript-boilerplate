import type { CorsOptions } from 'cors';

/**
 * With an explicit allow-list, only those origins are accepted and credentials are enabled.
 * Without one, any origin is accepted but credentials stay off: browsers reject
 * `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true`.
 */
export function createCorsOptions(origins: readonly string[]): CorsOptions {
    if (origins.length === 0) return { origin: '*' };
    return { origin: [...origins], credentials: true };
}
