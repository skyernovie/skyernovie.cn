/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 语义色：全部指向 index.css 里的 CSS 变量，跟随明暗主题自动变化
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accentSoft: 'rgb(var(--accent-soft) / <alpha-value>)',
        // Minecraft 主题色（与 index.css 里的 CSS 变量配合使用）
        grass: { DEFAULT: '#5fd068', 300: '#8ef1a0', 400: '#6fdc77', 500: '#5fd068', 600: '#49b455', 700: '#2f8f3e', ink: '#05200c' },
        diamond: { DEFAULT: '#4fe0d0', 600: '#2fbcae', 700: '#0e8a80' },
        gold: { DEFAULT: '#f5c542', 600: '#d9a72b', 700: '#a1741a' },
        redstone: { DEFAULT: '#e05b4a', 600: '#c0392b' },
        bili: '#FB7299',
        primary: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '18px',
        '3xl': '24px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
      },
    },
  },
  plugins: [],
}
