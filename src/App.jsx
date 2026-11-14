import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import ParticleBackground from './components/ParticleBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loading from './components/Loading'
import ScrollToTopFab from './components/ScrollToTopFab'
import { ToastProvider } from './components/ui/Toast'

const TzXyz = lazy(() => import('./pages/TzXyz'))
const NotFound = lazy(() => import('./components/shared/NotFound'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
      }, 120)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}

/*
 * 内容兜底：万一某个 .reveal 元素因为脚本异常一直没进场，
 * 挂载 3 秒后把「已经滚进视口、但还不可见」的元素直接显示出来。它只会显示，不会隐藏任何东西。
 */
function RevealFailsafe() {
  const { pathname } = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const inView = rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
        if (inView) el.classList.add('is-in')
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ToastProvider>
          <ScrollToTop />
          <RevealFailsafe />

          <div className="page-backdrop relative min-h-screen transition-colors duration-300">
            <ParticleBackground />

            <a className="skip-link" href="#main">
              跳到主要内容
            </a>

            <Navbar />

            <main id="main" className="relative z-10" tabIndex={-1}>
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
        </ToastProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
