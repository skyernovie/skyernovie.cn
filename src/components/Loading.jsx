/*
 * 路由过渡：三块草方块从上方落下堆起来，比单纯的进度条更像"世界正在加载"。
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-start justify-center pt-32" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-6 w-6 rounded-[3px] border border-grass-600/40 bg-grass-500/80"
              style={{
                animation: 'block-drop 1.1s cubic-bezier(.34,1.56,.64,1) infinite',
                animationDelay: `${i * 130}ms`,
              }}
            />
          ))}
        </div>
        <p className="text-[12.5px] text-muted">正在生成世界…</p>
      </div>
      <span className="sr-only">加载中</span>
    </div>
  )
}
