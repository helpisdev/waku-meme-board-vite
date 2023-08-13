module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
    es2022: true,
    browser: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:storybook/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  plugins: [
    'react',
    'jsx-a11y',
    'jest',
    'jest-dom',
    'testing-library',
    '@typescript-eslint',
    'react-refresh',
    'unused-imports',
    'simple-import-sort',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.css'],
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
    {
      files: ['**/*.mjs'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2015,
      },
      extends: ['plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            endOfLine: 'auto',
          },
        ],
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.tsx', '.ts'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-unused-vars': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest-dom/prefer-checked': 'error',
    'jest-dom/prefer-enabled-disabled': 'error',
    'jest-dom/prefer-required': 'error',
    'jest-dom/prefer-to-have-attribute': 'error',
    'testing-library/no-await-sync-query': 'off',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'off',
      {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
  },
  ignorePatterns: ['dist', 'playwright.config.ts', './**/*.css'],
};
