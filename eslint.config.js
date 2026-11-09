import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
    { ignores: ['dist', 'coverage', 'node_modules'] },
    js.configs.recommended,
    // Sets up the TypeScript parser and rules. It also turns off `no-undef` for .ts files,
    // since the TypeScript compiler already reports undefined identifiers.
    ...tseslint.configs['flat/recommended'],
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
            },
        },
    },
];
