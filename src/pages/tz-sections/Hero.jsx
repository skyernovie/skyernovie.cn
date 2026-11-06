import { useLayoutEffect, useRef, useState } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import Button from '../../components/ui/Button'
import PixelIcon from '../../components/ui/PixelIcon'
import { profile } from '../../data/site'
import { easterEggs } from '../../data/easter-eggs'
import { gsap } from '../../utils/gsap'
import { bindMagnetic } from '../../utils/magnetic'
import TdButton from './TdButton'

/* 名字拆成中文名 + 英文名：中文走正色，英文用强调色，比整段渐变更有主次 */
const NAME_CUT = profile.name.search(/[A-Za-z]/)
const NAME_CN = NAME_CUT > 0 ? profile.name.slice(0, NAME_CUT) : profile.name
const NAME_EN = NAME_CUT > 0 ? profile.name.slice(NAME_CUT) : ''

/* 直播间地址在 socials 里，抽出来给右侧状态卡用 */
const LIVE_URL = profile.socials.find((s) => s.key === 'live')?.url

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

/* 等距视角的方块簇：草方块 + 钻石矿 + 金矿，纯 SVG 装饰 */
function BlockCluster({ className = '', ...rest }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 190"
      className={`pointer-events-none ${className}`}
      fill="none"
      {...rest}
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

/* 单个字符：外层 overflow-hidden 做蒙版，内层由 GSAP 逐字上滑 */
function Char({ ch, className = '' }) {
  return (
    <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
      <span data-hero="char" className={`inline-block will-change-transform ${className}`}>
        {ch}
      </span>
    </span>
  )
}

/* 右侧「直播间状态」像素卡：填补首屏右侧空区，只在宽屏出现（窄屏信息已由芯片承载） */
function LivePanel() {
  return (
    <a
      href={LIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-hero="panel"
      className="group relative hidden w-[248px] shrink-0 flex-col self-stretch lg:flex"
      aria-label={`前往 B 站直播间，${profile.schedule}`}
    >
      <div className="pixel-frame relative flex flex-1 flex-col overflow-hidden rounded-[6px] bg-line/[0.04] p-4 transition-transform duration-300 group-hover:-translate-y-1 dark:bg-white/[0.045]">
        {/* 方块簇插画：GSAP 视差 + 缓慢摇摆（不用 CSS float，避免 transform 冲突） */}
        <BlockCluster data-parallax="blocks" className="mx-auto -mt-1 w-[168px] opacity-90 dark:opacity-75" />

        <span className="mt-3 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-[1px] bg-redstone"
            style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }}
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-redstone">
            Live Schedule
          </span>
        </span>

        <span className="num mt-1.5 text-[19px] font-bold leading-tight text-ink">
          20:00 – 22:00
        </span>
        <span className="mt-1 text-[12px] leading-relaxed text-muted">
          每晚开播 · B 站直播间 303427
        </span>

        <span className="mt-3 inline-flex items-center gap-1 border-t border-line/10 pt-3 text-[12.5px] font-semibold text-accent">
          进入直播间
          <FiArrowUpRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </a>
  )
}

export default function Hero() {
  const rootRef = useRef(null)

  /* 头像彩蛋：boop 挤压动画 + 从语录库随机飘一句，一轮不重复、抽完重洗 */
  const [booping, setBooping] = useState(false)
  const [egg, setEgg] = useState(null)
  const boopTimer = useRef(0)
  const eggTimer = useRef(0)
  const eggId = useRef(0)
  const poolRef = useRef([])

  const handleBoop = () => {
    window.clearTimeout(boopTimer.current)
    window.clearTimeout(eggTimer.current)

    setBooping(true)
    boopTimer.current = window.setTimeout(() => setBooping(false), 460)

    if (poolRef.current.length === 0) {
      poolRef.current = [...easterEggs].sort(() => Math.random() - 0.5)
    }
    const text = poolRef.current.pop()
    const id = ++eggId.current
    setEgg({ id, text })
    eggTimer.current = window.setTimeout(() => {
      setEgg((cur) => (cur && cur.id === id ? null : cur))
    }, 1680)
  }

  /*
   * 开场时间线 + 常驻动效：
   * 卡片淡入 → 头像弹性落入 → 名字逐字上滑 → 芯片/简介/按钮级联 → 直播卡滑入；
   * 之后头像呼吸浮动、方块簇鼠标视差 + 缓慢摇摆、主按钮磁吸。
   * 减少动效偏好下整段不挂，内容天然可见（CSS 不做隐藏，GSAP 的 from 只在播放时设初态）。
   * 用 gsap.context + matchMedia，而不是 @gsap/react：避免 dev 预打包出第二个 React。
   */
  useLayoutEffect(() => {
    const q = gsap.utils.selector(rootRef)
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = rootRef.current

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from(q('[data-hero="card"]'), { y: 40, autoAlpha: 0, duration: 0.7 })
          .from(q('[data-hero="avatar"]'), {
            scale: 0.55,
            rotation: -10,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'back.out(1.7)',
          }, '-=0.35')
          .from(q('[data-hero="char"]'), {
            yPercent: 115,
            duration: 0.65,
            stagger: 0.04,
            ease: 'back.out(1.5)',
          }, '-=0.5')
          .from(q('[data-hero="chips"]'), { y: 18, autoAlpha: 0, duration: 0.45 }, '-=0.35')
          .from(q('[data-hero="tagline"]'), { y: 18, autoAlpha: 0, duration: 0.45 }, '-=0.3')
          .from(q('[data-hero="cta"] > *'), { y: 20, autoAlpha: 0, duration: 0.45, stagger: 0.06 }, '-=0.3')
          .from(q('[data-hero="panel"]'), { x: 60, rotation: 3, autoAlpha: 0, duration: 0.75 }, '-=0.55')

        /* 头像呼吸浮动 */
        gsap.to(q('[data-hero="avatar"]'), {
          y: -6,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: 1.2,
        })

        /* 方块簇缓慢摇摆 */
        const blocks = section.querySelector('[data-parallax="blocks"]')
        if (blocks) {
          gsap.to(blocks, { rotation: 1.6, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        }

        /* 鼠标视差：方块簇平移、直播卡轻微转向 */
        const panel = section.querySelector('[data-hero="panel"]')
        if (panel) gsap.set(panel, { transformPerspective: 800 })
        const to = (el, prop) =>
          el ? gsap.quickTo(el, prop, { duration: 0.9, ease: 'power3.out' }) : () => {}
        const bx = to(blocks, 'x')
        const by = to(blocks, 'y')
        const pr = to(panel, 'rotationY')
        const onMove = (e) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2
          const ny = (e.clientY / window.innerHeight - 0.5) * 2
          bx(nx * 14)
          by(ny * 10)
          pr(nx * 3)
        }
        window.addEventListener('mousemove', onMove)

        /* 磁吸：只给主按钮，克制一点 */
        const cleanups = Array.from(section.querySelectorAll('[data-magnetic]')).map((el) =>
          bindMagnetic(el),
        )

        return () => {
          window.removeEventListener('mousemove', onMove)
          cleanups.forEach((fn) => fn())
        }
      })
    }, rootRef)

    return () => {
      ctx.revert()
      mm.revert()
    }
  }, [])

  return (
    <section ref={rootRef} className="relative px-5 pt-28 sm:pt-32" aria-labelledby="hero-title">
      <div className="mx-auto max-w-5xl">
        <div data-hero="card" className="card card-sheen relative overflow-hidden p-7 sm:p-10">
          {/* 两团漂移极光，撑开首屏的氛围 */}
          <span aria-hidden="true" className="hero-aurora hero-aurora--a" />
          <span aria-hidden="true" className="hero-aurora hero-aurora--b" />

          <Ridge />

          {CORNERS.map((pos) => (
            <span key={pos} aria-hidden="true" className={`pointer-events-none absolute h-3 w-3 border-accent/35 ${pos}`} />
          ))}

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-9">
            {/* 头像（可点：触发彩蛋） */}
            <div data-hero="avatar" className="relative shrink-0">
              <div className="absolute inset-2 rounded-full bg-accent/30 blur-2xl" aria-hidden="true" />
              <button
                type="button"
                onClick={handleBoop}
                aria-label="头像彩蛋：点我试试"
                title="点我试试"
                className={`relative block cursor-pointer rounded-full ${booping ? 'avatar-boop' : ''}`}
              >
                <img
                  src={profile.avatar}
                  alt={`${profile.name} 的头像`}
                  width="152"
                  height="152"
                  fetchpriority="high"
                  decoding="async"
                  className="h-[128px] w-[128px] rounded-full border-2 border-accent/60 object-cover shadow-xl ring-4 ring-accent/15 sm:h-[152px] sm:w-[152px]"
                />
              </button>
              <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-lg border border-line/10 bg-[rgb(var(--bg))] shadow-md">
                <PixelIcon name="grass" size={15} />
              </span>
              {egg ? (
                <span key={egg.id} className="egg-bubble" role="status">
                  {egg.text}
                </span>
              ) : null}
            </div>

            {/* 信息 */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1
                id="hero-title"
                aria-label={profile.name}
                className="hero-title-shadow display-font text-[30px] font-bold leading-[1.12] tracking-tight text-ink sm:text-[44px] lg:text-[50px]"
              >
                {NAME_CN.split('').map((ch, i) => (
                  <Char key={`cn-${i}`} ch={ch} />
                ))}
                {NAME_EN
                  ? NAME_EN.split('').map((ch, i) => <Char key={`en-${i}`} ch={ch} className="text-accent" />)
                  : null}
              </h1>

              <div data-hero="chips" className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="chip chip-live">
                  <span
                    className="h-1.5 w-1.5 rounded-[1px] bg-redstone"
                    style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }}
                  />
                  {profile.schedule}
                </span>
                <span className="chip chip-muted">整合包 · 空岛实况</span>
              </div>

              <p data-hero="tagline" className="mt-3 text-[15px] leading-relaxed text-muted">
                {profile.tagline}
                <span className="mt-1 block text-[13px] opacity-80">{profile.note}</span>
              </p>

              <div data-hero="cta" className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                {profile.socials.map((item, i) => (
                  /* 待机浮动延迟 = 入场时间线播完(≈2.6s) + 各自相位，避免和 GSAP 抢 transform */
                  <span key={item.key} className="cta-float" style={{ animationDelay: `${2.6 + i * 0.45}s` }}>
                    <Button
                      href={item.url}
                      variant={item.variant}
                      icon={item.icon}
                      {...(item.variant === 'primary' ? { 'data-magnetic': true } : {})}
                    >
                      {item.label}
                    </Button>
                  </span>
                ))}
                <span className="cta-float" style={{ animationDelay: `${2.6 + profile.socials.length * 0.45}s` }}>
                  <TdButton />
                </span>
              </div>
            </div>

            {/* 右侧直播状态卡（宽屏专属） */}
            <LivePanel />
          </div>
        </div>
      </div>
    </section>
  )
}
