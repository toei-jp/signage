module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'prettier/prettier': [
            'warn',
            {
                eslintIntegration: false,
                printWidth: 192,
                wrapAttributes: false,
                arrowParens: 'always',
                tabWidth: 4,
                singleQuote: true,
                trailingComma: 'all',
            },
        ],
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
};
