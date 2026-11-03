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
    </footer>
  )
}
