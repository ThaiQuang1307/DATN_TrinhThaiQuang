module.exports =  {
    'env': {
        'node': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended'
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'no-unused-vars': 'warn',
        'linebreak-style': 0,
        'quotes': [
            'error', 'single', { 'avoidEscape': true }
        ],
        'indent': ['error', 4],
        'comma-dangle': ['warn', 'never'],
        'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
        'max-len': ['error', { 'code': 150 }],
        'operator-linebreak': ['error', 'after', { 'overrides': {
            '?': 'ignore',
            ':': 'ignore',
            '||': 'ignore'
        }}]
    }
}
