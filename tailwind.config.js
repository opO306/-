/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        card: 'var(--card)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        accent: "#9E7C3A", // 황금빛 서재
      keyframes: {
        pop: {
