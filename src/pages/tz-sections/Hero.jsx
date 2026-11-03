import Button from '../../components/ui/Button'
import PixelIcon from '../../components/ui/PixelIcon'
import { profile } from '../../data/site'
import TdButton from './TdButton'

/* 首屏底板上的方块山脊：纯 SVG，跟着主题淡入淡出，不影响可读性 */
function Ridge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-accent opacity-[0.07] dark:opacity-[0.13]"
    >
      <path
        d="M0 120V86H48V70H96V86H144V58H192V86H240V72H288V90H336V62H384V88H432V74H480V92H528V66H576V86H624V72H672V92H720V70H768V88H800V120Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="relative px-5 pt-28 sm:pt-32" aria-labelledby="hero-title">
      <div className="mx-auto max-w-5xl">
        <div className="reveal card card-sheen relative overflow-hidden p-7 sm:p-10">
          <Ridge />

          <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-start sm:gap-9">
            {/* 头像 */}
            <div className="relative shrink-0">
              <div className="absolute inset-2 rounded-full bg-accent/25 blur-2xl" aria-hidden="true" />
              <img
                src={profile.avatar}
                alt={`${profile.name} 的头像`}
                width="132"
                height="132"
                className="relative h-[116px] w-[116px] rounded-full border-2 border-accent/55 object-cover shadow-lg sm:h-[132px] sm:w-[132px]"
              />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-lg border border-line/10 bg-[rgb(var(--bg))] shadow-sm">
                <PixelIcon name="grass" size={13} />
              </span>
            </div>

            {/* 信息 */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="chip chip-accent">
                  <span
                    className="h-1.5 w-1.5 rounded-[1px] bg-accent"
                    style={{ animation: 'pulse-dot 2.4s ease-in-out infinite' }}
                  />
                  {profile.schedule}
                </span>
                <span className="chip chip-muted">整合包 · 空岛实况</span>
              </div>

              <h1
                id="hero-title"
                className="mt-4 bg-gradient-to-r from-ink via-ink to-accent bg-clip-text text-[28px] font-bold leading-tight tracking-tight text-transparent sm:text-[40px]"
              >
                {profile.name}
              </h1>

              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {profile.tagline}
                <br className="hidden sm:block" />
                <span className="text-[13px] opacity-80">{profile.note}</span>
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                {profile.socials.map((item) => (
                  <Button
                    key={item.key}
                    href={item.url}
                    variant={item.variant}
                    icon={item.icon}
                  >
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
