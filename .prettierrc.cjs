module.exports = {
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: 'auto',
  singleQuote: true,
  proseWrap: 'always',
  bracketSpacing: true,
  trailingComma: 'all',
  jsxSingleQuote: true,
  arrowParens: 'always',
  plugins: [require.resolve('prettier-plugin-organize-imports'), require.resolve('prettier-plugin-tailwindcss')],
};
