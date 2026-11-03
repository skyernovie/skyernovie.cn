import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'system';
}

function getInitialGlow() {
  const saved = localStorage.getItem('mouseGlow');
  return saved !== null ? saved === 'true' : true;
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [mouseGlow, setMouseGlow] = useState(getInitialGlow);

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') setTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setThemeAndPersist = useCallback((t) => {
    setTheme(t);
    localStorage.setItem('theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeAndPersist(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setThemeAndPersist]);

  const toggleMouseGlow = useCallback(() => {
    setMouseGlow(prev => {
      const next = !prev;
      localStorage.setItem('mouseGlow', String(next));
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeAndPersist, toggleTheme, mouseGlow, toggleMouseGlow }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
