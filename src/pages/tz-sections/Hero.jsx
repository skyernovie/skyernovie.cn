import Button from '../../components/ui/Button'
import PixelIcon from '../../components/ui/PixelIcon'
import { profile } from '../../data/site'
import TdButton from './TdButton'

/* 名字拆成中文名 + 英文名：中文走正色，英文用强调色，比整段渐变更有主次 */
const NAME_CUT = profile.name.search(/[A-Za-z]/)
const NAME_CN = NAME_CUT > 0 ? profile.name.slice(0, NAME_CUT) : profile.name
const NAME_EN = NAME_CUT > 0 ? profile.name.slice(NAME_CUT) : ''

/* 卡片四角的像素直角标记，作为首屏卡片的专属细节 */
const CORNERS = [
  'left-3 top-3 border-l-2 border-t-2',
  'right-3 top-3 border-r-2 border-t-2',
  'left-3 bottom-3 border-l-2 border-b-2',
  'right-3 bottom-3 border-r-2 border-b-2',
]

/* 首屏底板上的方块山脊：纯 SVG，跟着主题淡入淡出，不影响可读性 */
function Ridge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-accent opacity-[0.06] [mask-image:linear-gradient(to_top,#000_40%,transparent)] dark:opacity-[0.09]"
    >
      <path
        d="M0 120V86H48V70H96V86H144V58H192V86H240V72H288V90H336V62H384V88H432V74H480V92H528V66H576V86H624V72H672V92H720V70H768V88H800V120Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* 首屏右侧的方块簇：等距视角的草方块 + 矿石方块，纯 SVG 装饰，窄屏隐藏避免挤压文字 */
function BlockCluster() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 190"
      className="pointer-events-none absolute right-4 top-8 hidden w-[210px] opacity-60 lg:block dark:opacity-40"
      fill="none"
    >
      {/* 草方块 */}
      <polygon points="60,20 110,45 60,70 10,45" fill="rgb(var(--accent-soft) / 0.75)" />
      <polygon points="10,45 60,70 60,118 10,93" fill="rgb(var(--muted) / 0.5)" />
      <polygon points="60,70 110,45 110,93 60,118" fill="rgb(var(--muted) / 0.32)" />
      {/* 草皮边缘 */}
      <polygon points="10,45 60,70 60,75 10,50" fill="rgb(var(--accent) / 0.5)" />
      <polygon points="60,70 110,45 110,50 60,75" fill="rgb(var(--accent) / 0.36)" />

      {/* 钻石矿 */}
      <polygon points="158,92 186,106 158,120 130,106" fill="rgb(var(--diamond) / 0.55)" />
      <polygon points="130,106 158,120 158,150 130,136" fill="rgb(var(--diamond) / 0.3)" />
      <polygon points="158,120 186,106 186,136 158,150" fill="rgb(var(--diamond) / 0.2)" />

      {/* 金矿 */}
      <polygon points="46,118 68,129 46,140 24,129" fill="rgb(var(--gold) / 0.5)" />
      <polygon points="24,129 46,140 46,164 24,153" fill="rgb(var(--gold) / 0.3)" />
      <polygon points="46,140 68,129 68,153 46,164" fill="rgb(var(--gold) / 0.2)" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative px-5 pt-28 sm:pt-32" aria-labelledby="hero-title">
      <div className="mx-auto max-w-5xl">
        <div className="reveal card card-sheen relative overflow-hidden p-7 sm:p-10">
          <Ridge />

          {CORNERS.map((pos) => (
            <span key={pos} aria-hidden="true" className={`pointer-events-none absolute h-3 w-3 border-accent/35 ${pos}`} />
          ))}

          <BlockCluster />

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-start sm:gap-9">
            {/* 头像 */}
            <div className="hero-step relative shrink-0" style={{ '--step': '0ms' }}>
              <div className="absolute inset-2 rounded-full bg-accent/25 blur-2xl" aria-hidden="true" />
              <img
                src={profile.avatar}
                alt={`${profile.name} 的头像`}
                width="132"
                height="132"
                fetchpriority="high"
                decoding="async"
                className="relative h-[116px] w-[116px] rounded-full border-2 border-accent/55 object-cover shadow-lg sm:h-[132px] sm:w-[132px]"
              />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-lg border border-line/10 bg-[rgb(var(--bg))] shadow-sm">
                <PixelIcon name="grass" size={13} />
              </span>
            </div>

            {/* 信息 */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1
                id="hero-title"
                className="hero-step hero-title-shadow display-font text-[28px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[40px]"
                style={{ '--step': '80ms' }}
              >
                {NAME_CN}
                {NAME_EN ? <span className="text-accent">{NAME_EN}</span> : null}
              </h1>

              <div
                className="hero-step mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
                style={{ '--step': '160ms' }}
              >
                <span className="chip chip-live">
                  <span
                    className="h-1.5 w-1.5 rounded-[1px] bg-redstone"
                    style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }}
                  />
                  {profile.schedule}
                </span>
                <span className="chip chip-muted">整合包 · 空岛实况</span>
              </div>

              <p className="hero-step mt-3 text-[15px] leading-relaxed text-muted" style={{ '--step': '240ms' }}>
                {profile.tagline}
                <span className="mt-1 block text-[13px] opacity-80">{profile.note}</span>
              </p>

              <div
                className="hero-step mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start"
                style={{ '--step': '320ms' }}
              >
                {profile.socials.map((item) => (
                  <Button key={item.key} href={item.url} variant={item.variant} icon={item.icon}>
                    {item.label}
                  </Button>
                ))}
                <TdButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
