module.exports = {
  root: true,
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:cypress/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    requireConfigFile: false,
  },
  plugins: ['react', 'react-hooks', 'prettier', 'import'],
  rules: {
    'react/jsx-uses-react': 'warn',
    'react/jsx-fragments': 'warn',
    'no-unused-vars': 'warn',
    'react/jsx-uses-vars': 'warn',
    'import/order': 'warn',
    'prettier/prettier': 'warn',
    'react/display-name': 'off',
    'no-shadow': 'off',
    'no-empty-pattern': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    radix: 'off',
  },
  settings: {
    react: {
      version: '17.0.1',
    },
  },
  globals: {
    setTimeout: false,
    document: false,
    localStorage: false,
    clearInterval: false,
    setInterval: false,
    process: false,
    FormData: false,
    window: false,
    Promise: false,
  },
  env: {
    browser: true,
    node: true,
  },
}
