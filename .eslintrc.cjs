module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    // 'max-len': ['error', 120],
    'linebreak-style': ['error', 'unix'],
    // quotes: ['error', 'double'],
    semi: ['error', 'always'],
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    quotes: 'avoidEscape',
    '@typescript-eslint/no-shadow': 'error',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
};
