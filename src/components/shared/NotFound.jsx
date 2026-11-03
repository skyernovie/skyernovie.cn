import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import PixelIcon from '../ui/PixelIcon'

/*
 * 404 做成"掉出世界边界"的彩蛋：上方一小块地形，下面是虚空。
 */
export default function NotFound({ title = '页面未找到', backTo = '/', backLabel = '返回主页' }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 text-center">
      <div
        className="relative mb-8 h-28 w-full max-w-md overflow-hidden rounded-2xl border border-line/10 bg-[#080c14]"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-5 bg-grass-500/20" />
        <div className="absolute inset-x-0 top-4 h-1 bg-grass-500/45" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/70" />
        <span
          className="absolute left-1/2 top-6 -translate-x-1/2 text-muted"
          style={{ animation: 'float 3.4s ease-in-out infinite' }}
        >
          <PixelIcon name="user" size={30} />
        </span>
        <span className="absolute inset-x-0 bottom-2 text-[9px] uppercase tracking-[0.42em] text-muted/50">
          the void
        </span>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">404 · Out of World</p>
      <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted">
        你走到了世界边界之外。这个地址不存在，或者已经被移走了。
      </p>

      <Link to={backTo} className="btn btn-primary mt-7">
        <FiArrowLeft size={15} aria-hidden="true" />
        {backLabel}
      </Link>
    </div>
  )
}
