/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indorama: {
          dark: '#002244',
          primary: '#003F7A',
          hover: '#00529B',
          accent: '#0070BA',
          slate: '#F4F7FA',
          panel: '#FFFFFF',
          border: '#D2DEE9',
          borderDark: '#B0C4D6',
          textMuted: '#5F7387',
          textDark: '#0F2438'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'Segoe UI', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
