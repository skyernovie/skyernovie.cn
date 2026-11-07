import { useCallback, useEffect, useRef, useState } from 'react'
import { FiThumbsUp } from 'react-icons/fi'
import { useToast } from '../../components/ui/Toast'
import { burstMeteors } from '../../utils/easterEgg'

/*
 * TD 点赞按钮：服务端计数（api.zhcool520.xyz），失败时回落到 localStorage，不会卡住页面。
 * 全站计数只负责按钮上的数字；下面的阈值按「自己点过的次数」计算，
 * 跨过阈值时弹对应预设语句，不混用头像彩蛋语录。
 */
const WORKER_URL = 'https://api.zhcool520.xyz'

const MILESTONES = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]

const MILESTONE_TEXT = {
  10: '不错哦，继续！',
  50: '手速可以啊！',
  100: '百发百中！',
  200: '停不下来了是吧',
  500: '燃起来了！',
  1000: '千锤百炼！',
  2000: '你是认真的吗',
  5000: '大佬受我一拜',
  10000: '万中无一！',
  20000: '二万五千里长征',
  50000: '五万封顶？不存在的',
  100000: '挑战无AE通关格雷科技吧',
}

export default function TdButton() {
  const toast = useToast()
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tz_td_count_backup')
    return saved ? parseInt(saved, 10) : 0
  })
  const [clicks, setClicks] = useState([])
  const [offline, setOffline] = useState(false)
  const [notice, setNotice] = useState(null)
  const wrapperRef = useRef(null)
  const countRef = useRef(0)
  const streakRef = useRef(parseInt(localStorage.getItem('tz_td_streak_backup'), 10) || 0)
  const clickId = useRef(0)
  const noticeId = useRef(0)
  const noticeTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  /* 按钮上方的提示气泡：同一时间只显示一条，新的覆盖旧的 */
  const showNotice = useCallback((text, duration) => {
    window.clearTimeout(noticeTimer.current)
    const key = ++noticeId.current
    setNotice({ id: key, text })
    noticeTimer.current = window.setTimeout(() => {
      setNotice((cur) => (cur && cur.id === key ? null : cur))
    }, duration)
  }, [])

  useEffect(() => {
    fetch(`${WORKER_URL}/get?_t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.value === undefined) return
        countRef.current = Math.max(countRef.current, data.value)
        setCount(countRef.current)
        localStorage.setItem('tz_td_count_backup', String(countRef.current))
        setOffline(false)
      })
      .catch(() => setOffline(true))
  }, [])

  useEffect(() => {
    if (clicks.length === 0) return
    const timer = setTimeout(() => setClicks((prev) => prev.slice(1)), 800)
    return () => clearTimeout(timer)
  }, [clicks])

  const handleTd = useCallback(
    (event) => {
      const id = ++clickId.current
      const rect = wrapperRef.current?.getBoundingClientRect()
      const x = event.clientX - (rect?.left || 0)
      const y = event.clientY - (rect?.top || 0)

      const prev = countRef.current
      const next = prev + 1
      countRef.current = next
      setCount(next)
      setClicks((list) => [...list.slice(-8), { id, x, y }])

      const prevStreak = streakRef.current
      const nextStreak = prevStreak + 1
      const hit = MILESTONES.find((m) => prevStreak < m && nextStreak >= m)
      if (hit && MILESTONE_TEXT[hit]) {
        /* 自己点的次数跨过阈值：弹对应预设语句，并给背景放一串流星 */
        toast(MILESTONE_TEXT[hit], { title: `里程碑 ${hit}`, icon: 'gold' })
        showNotice(MILESTONE_TEXT[hit], 2200)
        burstMeteors()
      }
      streakRef.current = nextStreak
      localStorage.setItem('tz_td_streak_backup', String(nextStreak))

      fetch(`${WORKER_URL}/hit?_t=${Date.now()}`, { method: 'POST' })
        .then((r) => r.json())
        .then((data) => {
          if (data.value === undefined) return
          countRef.current = Math.max(countRef.current, data.value)
          setCount(countRef.current)
          localStorage.setItem('tz_td_count_backup', String(countRef.current))
          setOffline(false)
        })
        .catch(() => setOffline(true))
    },
    [toast, showNotice],
  )

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      {notice ? (
        <span key={notice.id} className="egg-bubble egg-bubble--above" role="status">
          {notice.text}
        </span>
      ) : null}
      {clicks.map((c) => (
        <span
          key={c.id}
          className="pointer-events-none absolute z-40 h-1 w-1 rounded-full bg-redstone/70"
          style={{ left: c.x, top: c.y, animation: 'td-ripple 0.5s ease-out forwards' }}
        />
      ))}
      {clicks.map((c) => (
        <span
          key={`p-${c.id}`}
          className="num pointer-events-none absolute z-40 text-sm font-bold text-redstone"
          style={{ left: c.x, top: c.y, animation: 'td-float 0.8s ease-out forwards' }}
        >
          +1
        </span>
      ))}

      <button
        type="button"
        onClick={handleTd}
        title={offline ? '离线计数（服务端不可达）' : '点一下给 UP 主加个 TD'}
        className="btn btn-secondary group relative"
      >
        <FiThumbsUp size={15} className="text-redstone transition-transform group-hover:-rotate-6 group-hover:scale-110" />
        <span className="font-semibold">TD</span>
        <span className="num text-[12px] text-muted transition-colors group-hover:text-ink">
          {count.toLocaleString('zh-CN')}
        </span>
        {offline && <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />}
      </button>

      <style>{`
        @keyframes td-ripple {
          0% { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(26); opacity: 0; }
        }
        @keyframes td-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-26px) scale(1.35); opacity: 0.9; }
          100% { transform: translateY(-50px) scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
