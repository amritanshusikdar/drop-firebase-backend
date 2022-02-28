module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'google',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: [
        '/dist/**/*', // Ignore built files.
    ],
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        quotes: ['error', 'single'],
        indent: ['error', 4],
        semi: ['error', 'always'],
        'max-len': ['warn', { code: 80 }],
        'quote-props': ['warn', 'as-needed'],
        'no-cond-assign': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'import/no-default-export': 2,
        'import/no-unresolved': 0,
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src/'],
            },
        },
    },
};
