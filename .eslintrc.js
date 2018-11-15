const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', 'airbnb-base', 'prettier'],
    plugins: ['vue'],
    settings: {
        'import/resolver': {
            alias: {
                map: [['@', resolve('src')]],
                extensions: ['.vue', '.js'],
            },
        },
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: 0,
        camelcase: 0,
        'no-alert': 0,
        'linebreak-style': [0, 'windows'],
        'no-underscore-dangle': 0,
        'no-param-reassign': 0,
        'max-len': 0,
        'no-plusplus': 0,
        'arrow-body-style': 0,
        'global-require': 0,
        'import/no-dynamic-require': 0,
        'prefer-promise-reject-errors': 0,
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
