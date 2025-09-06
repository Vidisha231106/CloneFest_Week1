// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#faf5ff', 100:'#f3e8ff', 200:'#e9d5ff', 300:'#d8b4fe', 400:'#c084fc', 500:'#a855f7', 600:'#9333ea', 700:'#7e22ce', 800:'#6b21a8', 900:'#581c87' },
        dark: { 900:'#0f172a', 800:'#1e293b', 700:'#334155', 600:'#475569', 500:'#64748b' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      // ... your other theme extensions are fine
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}