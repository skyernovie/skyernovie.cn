import { easterEggs } from '../data/easter-eggs'

/* 彩蛋触发时通知背景层放流星，组件与画布之间用自定义事件解耦 */
export const EGG_EVENT = 'tz:easter-egg'

/* 语录池放在模块级：头像和点赞按钮共用同一轮，保证一轮内不重复 */
let pool = []

/*
 * 抽取一句彩蛋台词：一轮抽完自动重新洗牌再来一轮。
 * 用 Fisher-Yates 而不是 sort(() => Math.random() - 0.5)，乱得更均匀。
 */
export function pickEasterEgg() {
  if (easterEggs.length === 0) return ''

  if (pool.length === 0) {
    pool = [...easterEggs]
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
  }

  return pool.pop()
}

export function burstMeteors() {
  window.dispatchEvent(new Event(EGG_EVENT))
}
