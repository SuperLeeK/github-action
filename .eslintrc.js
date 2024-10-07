module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'tabwidth': 2,
    'trailingComma': 'es5',
    'printWidth': 100,
    'semi': true,
    'singleQuote': true,
    // 여기에 추가적인 규칙을 정의할 수 있습니다
  },
};