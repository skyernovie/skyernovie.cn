import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import PixelIcon from './PixelIcon'

/*
 * 轻量提示条：复制群号、达成里程碑时弹出，样式是"成就达成"的弹窗。
 * 用 Context 暴露一个 push 函数，组件里 const toast = useToast(); toast('已复制 768587905')。
 */
const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)
  const timersRef = useRef(new Map())

  const push = useCallback((message, options = {}) => {
    const id = ++idRef.current
    const toast = {
      id,
      message,
      title: options.title ?? '成就达成',
      icon: options.icon ?? 'gold',
    }
    setItems((list) => [...list.slice(-2), toast])

    const timer = setTimeout(() => {
      setItems((list) => list.filter((item) => item.id !== id))
      timersRef.current.delete(id)
    }, options.duration ?? 2600)
    timersRef.current.set(id, timer)
    return id
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((toast) => (
          <div key={toast.id} className="toast-card">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-gold/15">
              <PixelIcon name={toast.icon} size={16} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                {toast.title}
              </span>
              <span className="text-[13px] font-medium">{toast.message}</span>
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
