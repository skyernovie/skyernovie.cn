import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext.jsx';

export default function MouseGlow() {
  const glowRef = useRef(null);
  const { mouseGlow } = useTheme();
  const enabledRef = useRef(mouseGlow);
  const moveRef = useRef(null);
  const shownRef = useRef(false);

  useEffect(() => { enabledRef.current = mouseGlow; }, [mouseGlow]);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // 保底一：触摸设备（pointer: coarse）没有鼠标，直接不挂监听；CSS 里也把它隐藏了
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    // 保底二：用户要求减少动态效果时不启用
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // 用 quickTo 取代"每个 mousemove 都 gsap.set"：高频鼠标下只保留最新位置，交给 GSAP 补间
    const xTo = gsap.quickTo(glow, 'x', { duration: 0.15, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 0.15, ease: 'power3.out' });
    moveRef.current = { xTo, yTo };

    const onMove = (e) => {
      if (!enabledRef.current) return;
      // 第一次移动直接定位，避免光晕从左上角"飞"过来
      if (!shownRef.current) {
        shownRef.current = true;
        gsap.set(glow, { x: e.clientX, y: e.clientY });
        gsap.to(glow, { opacity: 1, duration: 0.2 });
        return;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const hide = () => {
      shownRef.current = false;
      gsap.to(glow, { opacity: 0, duration: 0.15 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      moveRef.current = null;
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (!mouseGlow) {
      shownRef.current = false;
      gsap.to(glow, { opacity: 0, duration: 0.15 });
    }
  }, [mouseGlow]);

  return <div ref={glowRef} className="mouse-glow" style={{ opacity: 0 }} aria-hidden="true" />;
}
