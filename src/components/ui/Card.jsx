/*
 * 统一卡片容器。hover 时轻微上浮 + 强调色描边；sheen 打开后顶部会有一道像素高光。
 */
export default function Card({ as: Tag = 'div', hover = false, sheen = false, className = '', children, ...rest }) {
  const cls = ['card', hover && 'card-hover', sheen && 'card-sheen', className].filter(Boolean).join(' ')
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}
