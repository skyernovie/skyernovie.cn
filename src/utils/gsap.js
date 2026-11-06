import { gsap } from 'gsap'

/*
 * GSAP 单例：所有动效从这里取，保证全局只有一份注册。
 * 注意：刻意不引入 ScrollTrigger——区块入场仍走 IO + CSS reveal，
 * GSAP 只负责开场时间线、视差、磁吸、倾斜这类"体感"动效，控制包体。
 */
export { gsap }

export const reduceMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export const coarsePointer = () =>
  window.matchMedia?.('(pointer: coarse)').matches ?? false
