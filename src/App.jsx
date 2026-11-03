import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import MouseGlow from './components/MouseGlow';
import ScrollToTopFab from './components/ScrollToTopFab';

const TzXyz = lazy(() => import('./pages/TzXyz'));
const NotFound = lazy(() => import('./components/shared/NotFound'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

/*
 * 动画保底（fail-safe）。
 * 全站的进场动画都靠 ScrollTrigger 触发，元素先被 gsap.set 成 autoAlpha:0（visibility:hidden）。
 * 万一某个触发器没被创建或没触发（视口太矮、懒加载刚挂载、插件异常），那块内容会一直不可见。
 * 这里在每次路由挂载 2.5 秒后兜底一次：只把「当前在视口内、且仍被内联样式隐藏」的元素显示出来。
 * 它只会让内容出现，不会隐藏任何东西，也不会打扰已经播完的动画。
 */
function AnimationFailsafe() {
  const { pathname } = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => {
      const hidden = document.querySelectorAll('[style*="visibility: hidden"], [style*="visibility:hidden"]');
      hidden.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnimationFailsafe />
        <div className="relative min-h-screen page-backdrop transition-colors duration-300">
          <ParticleBackground />
          <MouseGlow />
          <Navbar />
          <main className="relative z-10">
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* 本站只有天真SkyerNovie 一个主页 */}
                <Route path="/" element={<TzXyz />} />
                {/* 旧地址 /tz 直接跳回主页 */}
                <Route path="/tz" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound title="页面未找到" backTo="/" backLabel="返回主页" />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ScrollToTopFab />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
