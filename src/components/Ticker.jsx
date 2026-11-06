/*
 * 跑马灯信息带：直播时间 + 系列名的无缝滚动条，
 * 放在数据栏与影院带之间，充当明暗两个世界的过渡。
 * 内容复制两份，track 平移 -50% 实现无缝循环；第二份对读屏隐藏。
 */
const ITEMS = [
  '每晚 20:00 – 22:00 直播',
  'Minecraft 整合包实况',
  '格雷空岛 · 已完结',
  '新星工程 · 已完结',
  '蜂蜂空坊 · 已完结',
  '新时代科技 · 已完结',
  '无限遗产 · 已完结',
  'B站 / 抖音 / QQ 同步更新',
]

function Row({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden || undefined}>
      {ITEMS.map((text) => (
        <span key={text} className="ticker-item">
          {text}
        </span>
      ))}
    </div>
  )
}

export default function Ticker() {
  return (
    <div className="ticker" role="marquee" aria-label="直播与系列信息滚动条">
      <div className="ticker-track">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  )
}
