/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        'space-mono': ['"Space Mono"', 'monospace'],
      },
      colors: {
        space: '#020408',
        amber: '#FFB347',
        crimson: '#8B0000',
        teal: '#00F5D4',
        'light-blue': '#C8E6FF',
        'deep-purple': '#1A0A2E',
      },
    },
  },
  plugins: [],
}
