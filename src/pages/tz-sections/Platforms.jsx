import { FiArrowUpRight } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import PixelIcon from '../../components/ui/PixelIcon'
import { platforms } from '../../data/site'

const TONES = {
  grass: 'border-grass-500/25 bg-grass-500/10 text-grass-700 dark:text-grass-400',
  gold: 'border-gold-500/25 bg-gold-500/10 text-gold-700 dark:text-gold-500',
  diamond: 'border-diamond-500/25 bg-diamond-500/10 text-diamond-700 dark:text-diamond-500',
}

export default function Platforms() {
  return (
    <section className="px-5 py-16 sm:py-20" aria-labelledby="platforms-title">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          icon="craft"
          label="Modpacks"
          title={<span id="platforms-title">整合包资源导航</span>}
          desc="模组授权的原因，本站不直接提供整合包文件。视频里用到的整合包，都能在下面几个平台找到。"
        />

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {platforms.map((item, index) => (
            <a
              key={item.key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal card card-hover group flex flex-col gap-3 p-5"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl border ${TONES[item.tone]}`}
              >
                <PixelIcon name={item.icon} size={20} />
              </span>

              <span className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-ink">{item.name}</span>
                <span className={`chip ${item.badgeTone}`}>{item.badge}</span>
              </span>

              <span className="text-[12.5px] leading-relaxed text-muted">{item.desc}</span>

              <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-muted transition-colors group-hover:text-accent">
                前往
                <FiArrowUpRight size={12} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
