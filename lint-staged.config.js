module.exports = {
  '*.{js,jsx,ts,tsx,astro,cjs}': ['eslint --fix', 'prettier --write'],
  '**/*.ts?(x)': () => 'pnpm run build:types',
  '*.{css,scss,md,mdx,json}': ['prettier --write'],
};
