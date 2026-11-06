import { gsap } from './gsap'

/*
 * 磁吸按钮：鼠标靠近时按钮被"吸"过去一点，离开时弹性回位。
 * 只在 Hero 的主按钮上用，强度克制，不然会显得飘。
 * 返回清理函数。
 */
export function bindMagnetic(el, strength = 0.28) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}
