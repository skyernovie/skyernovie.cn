import { easterEggs } from '../data/easter-eggs'

/* 彩蛋触发时通知背景层放流星，组件与画布之间用自定义事件解耦 */
export const EGG_EVENT = 'tz:easter-egg'

/* 语录池放在模块级：每次从剩余语录里随机抽，一轮内不重复，抽完自动重开一轮 */
let pool = []

/*
 * 抽取一句彩蛋台词：每次点击都随机从本轮未出现的语录中抽一条，
 * 不是按固定顺序发牌；一轮抽完后再重置池子。
 */
export function pickEasterEgg() {
  if (easterEggs.length === 0) return ''

  if (pool.length === 0) pool = [...easterEggs]

  const index = Math.floor(Math.random() * pool.length)
  return pool.splice(index, 1)[0]
}

export function burstMeteors() {
  window.dispatchEvent(new Event(EGG_EVENT))
}
