/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#0A0E17',
          card: '#111827',
          cardHover: '#172235',
          cardBorder: '#1F2937',
          sidebar: '#0D131F',
          surface: '#141C2E',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          emeraldDark: '#047857',
          sky: '#38BDF8',
          blue: '#2563EB',
          navy: '#1E3A8A',
          amber: '#F59E0B',
          rose: '#F43F5E',
          textPrimary: '#F3F4F6',
          textSecondary: '#9CA3AF',
          textMuted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.25)',
        'glow-sky': '0 0 20px -5px rgba(56, 189, 248, 0.25)',
        'glow-blue': '0 0 20px -5px rgba(37, 99, 235, 0.25)',
        'card-premium': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}

