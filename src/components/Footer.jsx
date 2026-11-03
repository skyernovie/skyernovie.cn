import { Link, useLocation } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { SiBilibili } from 'react-icons/si';

export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-8 px-6 z-10 border-t border-neutral-200/30 dark:border-white/5 glass-effect">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-mono gradient-text font-bold text-sm">天真SkyerNovie</span>
          <span className="text-xs text-neutral-400 dark:text-neutral-400">
            &copy; {currentYear} · Made with <FiHeart className="inline text-rose-400" size={12} />
          </span>
        </div>

        <div className="flex items-center gap-5">
          {pathname !== '/' && <Link to="/" className="btn-glass text-xs py-1.5 px-3 font-medium">回主页</Link>}
          <a
            href="https://space.bilibili.com/25770857"
            target="_blank"
            rel="noopener noreferrer"
            title="Bilibili 空间"
            className="w-9 h-9 rounded-xl glass-effect flex items-center justify-center text-neutral-500 hover:text-indigo-500 hover:scale-110 transition-all"
          >
            <SiBilibili size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
