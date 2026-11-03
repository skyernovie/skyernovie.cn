/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        neutral: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
          300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
          600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a',
        },
        dark: { bg: '#0a0a14', card: '#14142a', surface: '#1c1c38' },
        glass: {
          light: 'rgba(255,255,255,0.55)',
          border: 'rgba(255,255,255,0.25)',
          dark: 'rgba(20,20,42,0.45)',
          darkBorder: 'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        // 与 index.css 里的 @font-face + body 保持一致，避免下载了却没用的字体
        sans: ['Geist', 'system-ui', '-apple-system', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      backdropBlur: {
        glass: '32px',
      },
    },
  },
  plugins: [],
}
