/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.js',
    './.vitepress/**/*.vue',
    './.vitepress/**/*.ts',
    './components/**/*.vue',
    './**/*.md',
    '../src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
