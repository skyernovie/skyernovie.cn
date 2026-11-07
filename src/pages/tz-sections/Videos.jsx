import { useRef, useState } from 'react'
import { FiArrowUpRight, FiClock, FiPlay, FiStar } from 'react-icons/fi'
import SectionHeading from '../../components/ui/SectionHeading'
import { featuredVideo, videos } from '../../data/site'
import { useTilt } from '../../utils/useTilt'
import { useGlowContainer } from '../../utils/useGlow'

/* 系列标签的配色映射：格雷=草绿，新星工程=钻石青，蜜蜂/合集=金 */
const TAG_TONES = {
  accent: 'chip-accent',
  diamond: 'chip-diamond',
  gold: 'chip-gold',
}

/* 站长最喜欢的一集：默认停在封面 + 开始按钮，点了才挂 iframe 并开始播放 */
function FeaturedPlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="reveal card pixel-frame mt-9 overflow-hidden">
      <div className="relative aspect-video w-full bg-black">
        {playing ? (
          <iframe
            src={`${featuredVideo.embed}&autoplay=1`}
            title={featuredVideo.title}
            loading="lazy"
            scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`开始播放：${featuredVideo.title}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer"
          >
            <img
              src={featuredVideo.cover}
              alt=""
              width="1200"
              height="675"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
              aria-hidden="true"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-accent/60 group-hover:bg-black/60">
                <FiPlay size={14} className="translate-x-[1px]" aria-hidden="true" />
                开始
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="chip chip-gold">
            <FiStar size={12} aria-hidden="true" />
            站长最喜欢的一集
          </span>
          <h3 className="mt-3 text-[15px] font-semibold leading-snug text-ink">{featuredVideo.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{featuredVideo.desc}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <FiPlay size={11} aria-hidden="true" />
              <span className="num">{featuredVideo.views}</span>
              次播放
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiClock size={11} aria-hidden="true" />
              {featuredVideo.duration}
            </span>
          </div>
        </div>

        <a
          href={featuredVideo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-accent"
        >
          去 B 站看
          <FiArrowUpRight size={10} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}

function VideoCard({ item, index }) {
  const isCollection = item.collection === true
  const cardRef = useRef(null)
  useTilt(cardRef)

  return (
    <a
      ref={cardRef}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="reveal card card-glow group flex flex-col overflow-hidden hover:border-accent/40"
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
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
          aria-hidden="true"
        />

        <span
          className={`pixel-tag absolute left-3 top-3 ${
            isCollection ? 'pixel-tag--collection' : 'pixel-tag--ep'
          }`}
        >
          {item.badge}
        </span>

        <span
          className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <FiPlay size={20} className="translate-x-[1px]" />
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className={`chip ${TAG_TONES[item.tone] || 'chip-muted'}`}>{item.tag}</span>
        <h3 className="mt-3 line-clamp-2 min-h-[2.75em] text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{item.desc}</p>

        <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <FiPlay size={11} aria-hidden="true" />
            <span className="num">{item.views}</span>
            次播放
          </span>
          <span className="inline-flex items-center gap-1 font-medium transition-colors group-hover:text-accent">
            观看
            <FiArrowUpRight size={12} aria-hidden="true" />
          </span>
        </span>
      </div>
    </a>
  )
}

export default function Videos() {
  const gridRef = useRef(null)
  useGlowContainer(gridRef)

  return (
    <section id="tz-video" className="cinema-band scroll-mt-24 py-20 sm:py-24" aria-labelledby="videos-title">
      {/* 带内漂移光雾，让深色底不沉闷 */}
      <div className="band-aurora" aria-hidden="true">
        <span className="band-aurora-a" />
        <span className="band-aurora-b" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5">
        <SectionHeading
          icon="play"
          label="Selected Videos"
          title={<span id="videos-title">精选视频</span>}
          desc="模组整合包实况与系列合集，持续更新中"
        />

        <FeaturedPlayer />

        <div ref={gridRef} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((item, index) => (
            <VideoCard key={item.key} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
