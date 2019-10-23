module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ['warn', { args: 'none' }],
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
  },
};
