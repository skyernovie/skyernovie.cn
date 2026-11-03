import { FiArrowUpRight, FiPlay } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import PixelIcon from '../../components/ui/PixelIcon'
import { moreVideosUrl, videos } from '../../data/site'

function VideoCard({ item, index }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal card card-hover group block overflow-hidden"
      style={{ transitionDelay: `${Math.min(index, 4) * 70}ms` }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          width="640"
          height="360"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent"
          aria-hidden="true"
        />

        <span className="badge-dark absolute left-3 top-3">{item.badge}</span>
        <span className="badge-dark num absolute bottom-3 right-3">
          <FiPlay size={10} aria-hidden="true" />
          {item.views}
        </span>

        <span
          className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md">
            <FiPlay size={20} className="translate-x-[1px]" />
          </span>
        </span>
      </div>

      <div className="p-5">
        <span className="chip chip-muted">{item.tag}</span>
        <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{item.desc}</p>
      </div>
    </a>
  )
}

export default function Videos() {
  return (
    <section id="tz-video" className="scroll-mt-24 px-5 py-16 sm:py-20" aria-labelledby="videos-title">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon="play"
          label="Selected Videos"
          title={<span id="videos-title">精选视频</span>}
          desc="模组整合包实况与系列合集，持续更新中"
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((item, index) => (
            <VideoCard key={item.key} item={item} index={index} />
          ))}

          <a
            href={moreVideosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal card card-hover group flex flex-col items-center justify-center gap-4 p-8 text-center"
            style={{ transitionDelay: '320ms' }}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-[rgb(var(--accent-ink))]">
              <FiArrowUpRight size={22} aria-hidden="true" />
            </span>
            <span>
              <span className="flex items-center justify-center gap-1.5 text-[15px] font-semibold text-ink">
                去 B 站看全部
                <PixelIcon name="arrow" size={11} className="text-muted" />
              </span>
              <span className="mt-1.5 block text-[12.5px] text-muted">更多模组实况与合集</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
