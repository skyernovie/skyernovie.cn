import { useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

/*
 * 回顶按钮：滚动超过一屏才出现，外圈那道环显示当前阅读进度。
 */
const CIRCUMFERENCE = 2 * Math.PI * 15

export default function ScrollToTopFab() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const top = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        setVisible(top > 420)
        setProgress(max > 0 ? Math.min(1, top / max) : 0)
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

  const handleClick = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="返回顶部"
      className={`fixed bottom-6 right-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-line/10 bg-[rgb(var(--bg))]/85 text-ink shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 36 36"
        className="absolute inset-0 h-full w-full -rotate-90 text-accent"
      >
        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 120ms linear' }}
        />
      </svg>
      <FiArrowUp size={17} aria-hidden="true" />
    </button>
  )
}
