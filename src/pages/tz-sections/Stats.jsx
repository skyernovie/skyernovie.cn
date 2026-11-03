import PixelIcon from '../../components/ui/PixelIcon'
import { stats } from '../../data/site'

export default function Stats() {
  return (
    <section className="px-5 pt-5 sm:pt-7" aria-label="频道数据">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
        {stats.map((item, index) => (
          <div
            key={item.key}
            className="reveal card card-hover flex flex-col items-center gap-2 px-4 py-5 text-center"
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-line/[0.05] dark:bg-white/[0.06]">
              <PixelIcon name={item.icon} size={18} />
            </span>
            <span
              className={`num font-bold leading-none text-ink ${item.compact ? 'text-[16px]' : 'text-[22px]'}`}
              title={item.title}
            >
              {item.value}
            </span>
            <span className="text-[11.5px] text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
