import { useEffect } from 'react'
import { gsap, reduceMotion, coarsePointer } from './gsap'

/*
 * 3D 倾斜：卡片跟着鼠标做轻微翻转，配合 transformPerspective。
 * 只在视频卡上用；触屏与减少动效偏好下完全不挂载。
 * 注意：首次进入时把元素 transition 清空，避免和 .reveal 的 transform 过渡打架。
 */
export function useTilt(ref, max = 7) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduceMotion() || coarsePointer()) return undefined

    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })

    let entered = false
    const onMove = (e) => {
      if (!entered) {
        entered = true
        el.style.transition = 'none'
      }
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      ry(px * max)
      rx(-py * max)
    }
    const onLeave = () => {
      rx(0)
      ry(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, max])
}
