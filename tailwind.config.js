/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      colors: {
        bgPrimary: '#080c14',
        bgSecondary: '#0f1626',
        accentNeon: '#00ffaa',
        accentBlue: '#00bfff',
        accentPurple: '#9d4edd',
        critical: '#ff3b5c',
        warningHigh: '#ff8c00',
        warningMedium: '#ffcc00',
        successLow: '#00ffaa',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
      }
    },
  },
  plugins: [],
}
