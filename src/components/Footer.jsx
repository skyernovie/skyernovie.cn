import { Link, useLocation } from 'react-router-dom'
import { SiBilibili } from 'react-icons/si'
import PixelIcon from './ui/PixelIcon'

export default function Footer() {
  const { pathname } = useLocation()
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-line/10 px-5 py-7">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-[12.5px] text-muted sm:flex-row">
        <div className="flex items-center gap-2">
          <PixelIcon name="grass" size={13} />
          <span className="font-semibold text-ink">天真SkyerNovie</span>
          <span aria-hidden="true">·</span>
          <span>© {year} Minecraft 模组实况</span>
        </div>

        <div className="flex items-center gap-4">
          {pathname !== '/' && (
            <Link to="/" className="transition-colors hover:text-accent">
              回主页
            </Link>
          )}
          <a
            href="https://space.bilibili.com/25770857"
            target="_blank"
            rel="noopener noreferrer"
            title="B 站空间"
            aria-label="前往 B 站空间"
            className="grid h-8 w-8 place-items-center rounded-[9px] border border-line/10 text-muted transition-colors hover:border-bili/40 hover:text-bili"
          >
            <SiBilibili size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink/70">友情链接</span>
          <a
            href="https://www.zhcool.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold tracking-wide text-ink underline-offset-2 transition-colors hover:text-accent hover:underline"
          >
            WWW.ZHCOOL.XYZ
          </a>
        </span>
        <span aria-hidden="true" className="opacity-40">
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-ink/70">老网站</span>
          <a
            href="https://zhcool520.xyz/tz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold tracking-wide text-ink underline-offset-2 transition-colors hover:text-accent hover:underline"
          >
            ZHCOOL520.XYZ/TZ
          </a>
        </span>
      </div>
    </footer>
  )
}
