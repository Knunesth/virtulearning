/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Essencial para o tema dark funcionar
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: '#FFD700',
        accentHover: '#e6c200',
        danger: '#ef4444',
        success: '#22c55e'
      }
    }
  },
  plugins: [],
}
