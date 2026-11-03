import { useEffect } from 'react'

/*
 * 进场动画：给 .reveal 元素加 .is-in。
 * 用 IntersectionObserver 而不是给每一块建 ScrollTrigger —— 元素多的时候更省、也不会出现
 * "触发器没建好导致内容一直隐藏"的问题；不支持 IO 或用户要求减少动效时直接全部显示。
 */
export function useReveal(ref, deps = []) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const items = Array.from(root.querySelectorAll('.reveal'))
    if (!items.length) return

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )

    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
