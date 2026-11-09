import { describe, expect, test } from 'bun:test';

import { createCorsOptions } from '@/config/cors';

describe('createCorsOptions', () => {
    test('allows any origin without credentials when no allow-list is set', () => {
        expect(createCorsOptions([])).toEqual({ origin: '*' });
    });

    test('restricts to the allow-list and enables credentials when one is set', () => {
        expect(createCorsOptions(['https://app.example.com'])).toEqual({
            origin: ['https://app.example.com'],
            credentials: true,
        });
    });
});
