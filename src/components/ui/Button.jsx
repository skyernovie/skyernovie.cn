import { forwardRef } from 'react'

const isExternal = (href) => /^https?:\/\//i.test(href || '')

/*
 * 统一按钮：primary（草绿实心，一屏最多一个）/ secondary（描边）/ ghost（无边框）。
 * href 存在时渲染 <a>，外链自动补 target + rel。
 */
const Button = forwardRef(function Button(
  { href, variant = 'secondary', size, icon: Icon, iconRight: IconRight, className = '', children, ...rest },
  ref,
) {
  const Tag = href ? 'a' : 'button'
  const cls = ['btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className].filter(Boolean).join(' ')
  const linkProps = href
    ? { href, ...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : { type: rest.type || 'button' }

  return (
    <Tag ref={ref} className={cls} {...linkProps} {...rest}>
      {Icon ? <Icon size={16} aria-hidden="true" /> : null}
      {children}
      {IconRight ? <IconRight size={15} aria-hidden="true" /> : null}
    </Tag>
  )
})

export default Button
