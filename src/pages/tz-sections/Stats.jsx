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
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
        {stats.map((item, index) => {
          const align = index === 0 ? 'left' : index === stats.length - 1 ? 'right' : 'center'
          return (
            <div
              key={item.key}
              tabIndex={item.tip ? 0 : undefined}
              aria-describedby={item.tip ? `${item.key}-tip` : undefined}
              className={`reveal card card-hover flex flex-col items-center gap-2 px-4 py-5 text-center outline-none ${
                item.tip ? 'group cursor-help focus-visible:ring-2 focus-visible:ring-accent/40' : ''
              }`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-line/[0.05] dark:bg-white/[0.06]">
                <PixelIcon name={item.icon} size={18} />
              </span>
              <span
                className={`num font-bold leading-none text-ink ${item.compact ? 'text-[16px]' : 'text-[22px]'}`}
              >
                {item.value}
              </span>
              <span className="text-[11.5px] text-muted">{item.label}</span>

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
