import PixelIcon from './PixelIcon'

/*
 * 区块标题：小标签（英文/拼音，mono 大写）+ 主标题 + 说明 + 像素虚线。
 * align="center" 用于"粉丝社区 / 与我联系"这类居中区块，默认左对齐。
 */
export default function SectionHeading({ label, title, desc, icon, align = 'left', className = '' }) {
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'text-center flex flex-col items-center' : ''} ${className}`}>
      {label ? (
        <span className="section-label">
          {icon ? <PixelIcon name={icon} size={14} /> : null}
          {label}
        </span>
      ) : null}
      <h2 className="section-title">{title}</h2>
      {desc ? <p className={`section-desc ${centered ? 'max-w-xl' : 'max-w-lg'}`}>{desc}</p> : null}
      <div className={`pixel-rule ${centered ? 'mt-6' : 'mt-5'}`} />
    </div>
  )
}
