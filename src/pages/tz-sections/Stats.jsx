import { useEffect, useState } from 'react'
import PixelIcon from '../../components/ui/PixelIcon'
import { stats, statsNote } from '../../data/site'

/* 提示框配色：金色 = 重点提示，强调色 = 普通数据说明 */
const TIP_TONES = {
  gold: {
    bubble: 'border-gold/70 ring-gold/15',
    head: 'text-gold-600 dark:text-gold',
    dot: 'bg-gold',
    arrow: 'border-gold/70',
  },
  accent: {
    bubble: 'border-accent/60 ring-accent/15',
    head: 'text-accent',
    dot: 'bg-accent',
    arrow: 'border-accent/60',
  },
}

/* 图标底色分级：粉丝=主强调，系列=钻石青，更新频率=金，直播领域=红石 */
const ICON_TONES = {
  grass: 'border-accent/30 bg-accent/10 text-accent',
  diamond: 'border-diamond/30 bg-diamond/10 text-diamond-700 dark:text-diamond',
  gold: 'border-gold/30 bg-gold/10 text-gold-700 dark:text-gold',
  redstone: 'border-redstone/30 bg-redstone/10 text-redstone-600 dark:text-redstone',
}

/* 数字滚动：rAF + 缓出，减少动效偏好下直接给终值 */
function useCountUp(target, decimals) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!target) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 900
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return value.toFixed(decimals)
}

/* 把 "3.95万" / "3 天 / 期" 拆成「大数字 + 小单位」，纯文字值单独处理 */
function StatValue({ raw, animate }) {
  const parsed = raw.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const target = parsed ? parseFloat(parsed[1]) : null
  const decimals = parsed?.[1].includes('.') ? parsed[1].split('.')[1].length : 0
  const counted = useCountUp(animate ? target : null, decimals)

  if (!parsed) {
    return (
      <span className="flex h-[30px] items-center text-[15px] font-semibold leading-tight text-ink sm:h-[32px]">
        {raw}
      </span>
    )
  }

  const unit = parsed[2].trim()

  return (
    <span className="flex h-[30px] items-baseline gap-1 sm:h-[32px]">
      <span className="num text-[26px] font-bold leading-none text-ink sm:text-[30px]">
        {animate ? counted : parsed[1]}
      </span>
      {unit ? <span className="text-[11.5px] font-semibold leading-none text-muted">{unit}</span> : null}
    </span>
  )
}

function StatsTip({ item, align }) {
  const tone = TIP_TONES[item.tipTone] || TIP_TONES.accent
  const bubbleAlign =
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  const arrowAlign =
    align === 'left' ? 'left-8' : align === 'right' ? 'right-8' : 'left-1/2 -translate-x-1/2'

  return (
    <div
      id={`${item.key}-tip`}
      role="tooltip"
      className={`pointer-events-none absolute bottom-[calc(100%+10px)] z-30 hidden w-72 translate-y-1 rounded-xl border-2 bg-[rgb(var(--bg))] p-3 text-left opacity-0 shadow-2xl ring-4 transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 sm:block ${bubbleAlign} ${tone.bubble}`}
    >
      <span className={`mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-wide ${tone.head}`}>
        <span className={`h-1.5 w-1.5 rounded-[1px] ${tone.dot}`} />
        {item.tipTitle}
      </span>
      <span className="block text-[11.5px] leading-relaxed text-muted">{item.tip}</span>
      {/* 指向卡片的小箭头，做成像素方块的形状 */}
      <span
        aria-hidden="true"
        className={`absolute top-full h-2.5 w-2.5 translate-y-[-7px] rotate-45 border-b-2 border-r-2 bg-[rgb(var(--bg))] ${arrowAlign} ${tone.arrow}`}
      />
    </div>
  )
}

export default function Stats() {
  return (
    <section className="px-5 pt-5 sm:pt-7" aria-label="频道数据">
      <div className="reveal card card-sheen mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
        {stats.map((item, index) => {
          const align = index === 0 ? 'left' : index === stats.length - 1 ? 'right' : 'center'
          return (
            <div
              key={item.key}
              tabIndex={item.tip ? 0 : undefined}
              aria-describedby={item.tip ? `${item.key}-tip` : undefined}
              className={`group relative flex flex-col gap-2 border-line/[0.09] px-4 py-4 outline-none sm:px-6 sm:py-5 ${
                index === 1 || index === 3 ? 'border-l' : ''
              } ${index >= 2 ? 'border-t sm:border-t-0' : ''} ${index > 0 ? 'sm:border-l' : ''} ${
                item.tip ? 'cursor-help focus-visible:ring-2 focus-visible:ring-accent/40' : ''
              }`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-[9px] border ${ICON_TONES[item.icon]}`}>
                <PixelIcon name={item.icon} size={15} />
              </span>

              <StatValue raw={item.value} animate={!!item.tip} />

              <span className="text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-muted transition-colors group-hover:text-ink">
                {item.label}
              </span>

              {item.tip && <StatsTip item={item} align={align} />}
            </div>
          )
        })}
      </div>
      {/* 触摸屏没有 hover，说明文字只在窄屏常驻展示 */}
      <p className="mx-auto mt-3 max-w-5xl text-[11.5px] leading-relaxed text-muted sm:hidden">
        {statsNote}
      </p>
    </section>
  )
}
