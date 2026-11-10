import { FiArrowUpRight } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import { recommendation } from '../../data/site'

/*
 * 页面推荐：独立分栏，链接到另一位作者制作的静态页。
 * 那一页有自己的设计语言，和本站没有关系，这里只做入口。
 */
export default function Recommend() {
  const Icon = recommendation.icon

  return (
    <section id="tz-recommend" className="scroll-mt-24 px-5 py-16 sm:py-20" aria-labelledby="recommend-title">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          align="center"
          icon="sign"
          label="More pages"
          title={<span id="recommend-title">页面推荐</span>}
          desc="由另一位作者独立制作的页面，设计与本站各自独立。"
        />

        <div className="mx-auto mt-9 max-w-2xl">
          <a
            href={recommendation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal card card-glow group flex items-center gap-4 p-5 hover:border-gold/35"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">{recommendation.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-relaxed text-muted">{recommendation.desc}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3.5 py-2 text-[12.5px] font-semibold text-gold transition group-hover:bg-gold/15">
              前往阅读
              <FiArrowUpRight
                size={14}
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
