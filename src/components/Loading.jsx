export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-32" role="status" aria-live="polite">
      {/* 保底：这里只是路由切换时的过渡条，不再整屏覆盖，避免每次跳转都"闪一下白屏" */}
      <div className="w-40 h-1 rounded-full bg-indigo-500/15 overflow-hidden">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500/60 to-violet-500/60 animate-pulse" />
      </div>
      <span className="sr-only">加载中…</span>
    </div>
  );
}
