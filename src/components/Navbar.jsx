import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FiSun, FiMoon, FiMonitor, FiMousePointer, FiSettings } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';

/*
 * 本站就是天真SkyerNovie 的主页，导航只做页内锚点。
 */
const navLinks = [
  { name: '视频', href: '#tz-video' },
  { name: '社区', href: '#tz-community' },
  { name: '联系', href: '#tz-contact' },
];

function SettingsPopover({ isOpen, onClose }) {
  const { theme, setTheme, mouseGlow, toggleMouseGlow } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-3 w-56 p-4 rounded-2xl glass-effect shadow-2xl z-50 animate-scale-in">
      <div className="text-[11px] font-mono text-neutral-400 mb-3 px-1">显示设置</div>

      <div className="space-y-1.5 mb-4">
        {[
          { id: 'light', icon: FiSun, label: '浅色' },
          { id: 'dark', icon: FiMoon, label: '深色' },
          { id: 'system', icon: FiMonitor, label: '跟随系统' },
        ].map(mode => (
          <button key={mode.id} onClick={() => setTheme(mode.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              theme === mode.id
                ? 'bg-indigo-500/15 text-indigo-500 font-medium'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-white/30 dark:hover:bg-white/5'
            }`}>
            <mode.icon size={15} />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-white/10 to-transparent mb-3" />

      <button onClick={toggleMouseGlow}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
          mouseGlow
            ? 'text-indigo-500 font-medium'
            : 'text-neutral-500 dark:text-neutral-400'
        } hover:bg-white/30 dark:hover:bg-white/5`}>
        <div className="flex items-center gap-3">
          <FiMousePointer size={15} />
          <span>鼠标光效</span>
        </div>
        <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${mouseGlow ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
          <div className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${mouseGlow ? 'left-5 top-0.5' : 'left-0.5 top-0.5'}`} />
        </div>
      </button>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, resolvedTheme, setTheme, toggleTheme, mouseGlow, toggleMouseGlow } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const navRef = useRef(null);
  const scrollRafRef = useRef(null);
  const scrollRetryTimerRef = useRef(null);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' });
    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        setScrolled(window.scrollY > 50);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (scrollRetryTimerRef.current !== null) {
        clearTimeout(scrollRetryTimerRef.current);
        scrollRetryTimerRef.current = null;
      }
    };
  }, []);

  // 页内锚点（本站只有主页，理论上不会触发跳转分支，保留兜底）
  const scrollTo = (href) => {
    const doScroll = () => {
      const el = document.querySelector(href);
      if (!el) {
        // 如果元素不存在，稍后重试（页面刚挂载时区块可能还没渲染完）
        if (scrollRetryTimerRef.current !== null) clearTimeout(scrollRetryTimerRef.current);
        scrollRetryTimerRef.current = setTimeout(() => {
          scrollRetryTimerRef.current = null;
          const retryEl = document.querySelector(href);
          if (retryEl) {
            const top = retryEl.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 150);
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    if (!isHome) {
      navigate('/');
      requestAnimationFrame(() => requestAnimationFrame(doScroll));
    } else {
      doScroll();
    }
  };

  const handleNav = (href) => {
    setMobileOpen(false);
    scrollTo(href);
  };

  const toggleSettings = useCallback(() => setSettingsOpen(v => !v), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const linkClass = (active) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      active ? 'bg-indigo-500/10 text-indigo-500' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-white/5'
    }`;

  return (
    <nav ref={navRef} className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }); else navigate('/'); }}
          className="text-base sm:text-xl font-bold font-mono tracking-tight text-neutral-800 dark:text-neutral-100 hover:opacity-80 transition-opacity"
          aria-label="回到天真SkyerNovie主页"
        >
          <span className="gradient-text">天真SkyerNovie</span>
        </button>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => scrollTo(link.href)} className={linkClass(false)}>{link.name}</button>
          ))}
          <div className="relative ml-2">
            <button onClick={toggleSettings} className="p-2.5 rounded-xl text-neutral-400 hover:text-indigo-500 hover:bg-white/50 dark:hover:bg-white/5 transition-all" title="显示设置">
              <FiSettings size={18} />
            </button>
            <SettingsPopover isOpen={settingsOpen} onClose={closeSettings} />
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-xl text-neutral-400 hover:text-indigo-500 hover:bg-white/50 dark:hover:bg-white/5 transition-all">
            {resolvedTheme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button onClick={() => setMobileOpen((v) => !v)} className="p-2 rounded-xl text-neutral-500 hover:text-indigo-500 hover:bg-white/50 dark:hover:bg-white/5 transition-all">
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden glass-effect !bg-white/95 dark:!bg-neutral-900/95 mx-4 rounded-2xl mt-2 overflow-hidden max-h-[70vh] overflow-y-auto pb-[env(safe-area-inset-bottom)] animate-scale-in">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link, i) => (
              <div key={link.href}>
                {i > 0 && <div className="mx-3 h-px bg-gradient-to-r from-transparent via-neutral-200/30 dark:via-white/5 to-transparent" />}
                <button onClick={() => handleNav(link.href)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-200">
                  {link.name}
                </button>
              </div>
            ))}
            <div className="mx-3 h-px bg-gradient-to-r from-transparent via-neutral-200/30 dark:via-white/5 to-transparent mt-2" />
            <div className="px-4 py-3">
              <div className="text-[10px] font-mono text-neutral-400 mb-3">显示设置</div>
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'light', icon: FiSun, label: '浅' },
                  { id: 'dark', icon: FiMoon, label: '深' },
                  { id: 'system', icon: FiMonitor, label: '自动' },
                ].map(mode => (
                  <button key={mode.id} onClick={() => setTheme(mode.id)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      theme === mode.id
                        ? 'bg-indigo-500/15 text-indigo-500'
                        : 'text-neutral-500 dark:text-neutral-400 bg-white/20 dark:bg-white/5 hover:text-indigo-500'
                    }`}>
                    {mode.label}
                  </button>
                ))}
              </div>
              <button onClick={toggleMouseGlow}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                  mouseGlow ? 'text-indigo-500' : 'text-neutral-500 dark:text-neutral-400'
                } bg-white/20 dark:bg-white/5 hover:text-indigo-500`}>
                <span>鼠标光效</span>
                <div className={`relative w-9 h-4 rounded-full transition-colors duration-300 ${mouseGlow ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                  <div className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 ${mouseGlow ? 'left-5 top-0.5' : 'left-0.5 top-0.5'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
