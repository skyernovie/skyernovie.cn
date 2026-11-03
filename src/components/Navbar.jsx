import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FiSun, FiMoon, FiMonitor, FiMousePointer, FiSettings } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext.jsx'
import PixelIcon from './ui/PixelIcon'

/*
 * 本站就是天真SkyerNovie 的主页，导航只做页内锚点：
 * 顶部有滚动进度条，当前区块高亮；移动端抽屉支持 ESC / 点遮罩关闭并锁滚动。
 */
const NAV_LINKS = [
  { name: '视频', href: '#tz-video' },
  { name: '社区', href: '#tz-community' },
  { name: '联系', href: '#tz-contact' },
]

function SettingsPopover({ open, onClose, anchorRef }) {
  const { theme, setTheme, mouseGlow, toggleMouseGlow } = useTheme()
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (event) => {
      if (ref.current?.contains(event.target) || anchorRef.current?.contains(event.target)) return
      onClose()
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
        anchorRef.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div
      ref={ref}
      id="display-settings"
      className="card absolute right-0 top-full z-50 mt-3 w-60 p-2 shadow-xl"
    >
      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        显示设置
      </p>

      {[
        { id: 'light', icon: FiSun, label: '浅色' },
        { id: 'dark', icon: FiMoon, label: '深色' },
        { id: 'system', icon: FiMonitor, label: '跟随系统' },
      ].map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => setTheme(mode.id)}
          aria-pressed={theme === mode.id}
          className={`flex w-full items-center gap-3 rounded-[9px] px-3 py-2 text-[13px] transition-colors ${
            theme === mode.id
              ? 'bg-accent/12 font-medium text-accent'
              : 'text-muted hover:bg-line/[0.04] hover:text-ink dark:hover:bg-white/[0.05]'
          }`}
        >
          <mode.icon size={14} aria-hidden="true" />
          {mode.label}
        </button>
      ))}

      <div className="my-2 h-px bg-line/10" />

      <button
        type="button"
        onClick={toggleMouseGlow}
        aria-pressed={mouseGlow}
        className={`flex w-full items-center justify-between rounded-[9px] px-3 py-2 text-[13px] transition-colors ${
          mouseGlow ? 'text-accent' : 'text-muted'
        } hover:bg-line/[0.04] dark:hover:bg-white/[0.05]`}
      >
        <span className="flex items-center gap-3">
          <FiMousePointer size={14} aria-hidden="true" />
          鼠标光效
        </span>
        <span
          className={`relative h-4 w-8 rounded-full transition-colors duration-300 ${
            mouseGlow ? 'bg-accent' : 'bg-line/20'
          }`}
          aria-hidden="true"
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-300 ${
              mouseGlow ? 'left-[18px]' : 'left-0.5'
            }`}
          />
        </span>
      </button>
    </div>
  )
}

export default function Navbar() {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const settingsAnchor = useRef(null)
  const mobilePanelRef = useRef(null)
  const menuButtonRef = useRef(null)
  const rafRef = useRef(null)

  // 进度条 + 当前区块高亮（同一帧里算，避免多次布局）
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const top = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(top > 12)
        setProgress(max > 0 ? Math.min(100, (top / max) * 100) : 0)

        let current = ''
        for (const link of NAV_LINKS) {
          const el = document.querySelector(link.href)
          if (el && el.getBoundingClientRect().top <= 160) current = link.href
        }
        setActiveId(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // 路由变化关掉所有浮层
  useEffect(() => {
    setMobileOpen(false)
    setSettingsOpen(false)
  }, [location.pathname])

  // 抽屉打开时锁滚动 + ESC 关闭
  useEffect(() => {
    if (!mobileOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  const scrollTo = useCallback(
    (href) => {
      const go = () => {
        const el = document.querySelector(href)
        if (!el) return
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        const top = el.getBoundingClientRect().top + window.scrollY - 88
        window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
      }
      if (!isHome) {
        navigate('/')
        requestAnimationFrame(() => requestAnimationFrame(go))
      } else {
        go()
      }
    },
    [isHome, navigate],
  )

  const handleNav = (href) => {
    setMobileOpen(false)
    scrollTo(href)
  }

  return (
    <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <button
          type="button"
          onClick={() => {
            if (isHome) {
              const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
              window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
            } else {
              navigate('/')
            }
          }}
          className="group flex items-center gap-2"
          aria-label="回到天真SkyerNovie 主页顶部"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[9px] border border-line/10 bg-[rgb(var(--bg))] shadow-sm transition-transform group-hover:-translate-y-0.5">
            <PixelIcon name="grass" size={15} />
          </span>
          <span className="text-[15px] font-bold tracking-tight text-ink">天真SkyerNovie</span>
        </button>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="页面导航">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollTo(link.href)}
              className={`nav-link ${activeId === link.href ? 'is-active' : ''}`}
              aria-current={activeId === link.href ? 'true' : undefined}
            >
              {link.name}
            </button>
          ))}

          <div className="relative ml-1.5" ref={settingsAnchor}>
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className="btn btn-ghost btn-icon"
              aria-label="显示设置"
              aria-expanded={settingsOpen}
              aria-controls="display-settings"
            >
              <FiSettings size={17} aria-hidden="true" />
            </button>
            <SettingsPopover
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              anchorRef={settingsAnchor}
            />
          </div>
        </nav>

        {/* 移动端 */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label={resolvedTheme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
          >
            {resolvedTheme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="btn btn-ghost btn-icon"
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <HiX size={21} /> : <HiMenuAlt3 size={21} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[57px] z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            ref={mobilePanelRef}
            className="card absolute inset-x-4 top-full z-50 mt-1 flex flex-col gap-1 p-2 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNav(link.href)}
                className="rounded-[10px] px-4 py-3 text-left text-[14px] font-medium text-ink transition-colors hover:bg-line/[0.04] dark:hover:bg-white/[0.05]"
              >
                {link.name}
              </button>
            ))}

            <div className="my-1 h-px bg-line/10" />

            <div className="px-3 pb-1 pt-1.5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                显示设置
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'light', label: '浅' },
                  { id: 'dark', label: '深' },
                  { id: 'system', label: '自动' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTheme(mode.id)}
                    className="rounded-[9px] border border-line/10 px-2 py-2 text-[12px] text-muted aria-pressed:border-accent/40 aria-pressed:bg-accent/12 aria-pressed:text-accent"
                    aria-pressed={theme === mode.id}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
