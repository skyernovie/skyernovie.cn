import { useEffect } from 'react'
import { coarsePointer } from './gsap'

/*
 * 光斑追踪（容器版）：一个监听器挂在网格容器上，
 * 鼠标经过任何一张 .card-glow 卡片时，把 --mx/--my 写到那张卡片上，
 * 卡片 ::after 的径向光斑随之移动。比每张卡挂一个监听器省。
 */
export function useGlowContainer(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined
    if (coarsePointer()) return undefined

    const onMove = (e) => {
      const card = e.target.closest?.('.card-glow')
      if (!card || !root.contains(card)) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }

    root.addEventListener('mousemove', onMove)
    return () => root.removeEventListener('mousemove', onMove)
  }, [ref])
}
