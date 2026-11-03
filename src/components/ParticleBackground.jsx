import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const LINK_DISTANCE = 100;
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update(width, height) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(null);
  const runningRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // 颜色强度放进 ref，主题切换时只改数值，不重启动画循环
  const alphaRef = useRef({
    particle: isDark ? 0.8 : 0.5,
    line: isDark ? 0.06 : 0.04,
  });

  useEffect(() => {
    alphaRef.current = {
      particle: isDark ? 0.8 : 0.5,
      line: isDark ? 0.06 : 0.04,
    };
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 保底一：用户要求"减少动态效果"时完全不启动，页面其余部分不受任何影响
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (motionQuery?.matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 保底二：拿不到尺寸（极端情况）就不画，避免 0 尺寸画布报错
    if (!width || !height) return;

    const applySize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    applySize();

    // 粒子数量按面积算，手机等窄屏不再塞过多粒子
    const count = Math.min(Math.round((width * height) / 22000), 90);
    particlesRef.current = Array.from({ length: count }, () => new Particle(width, height));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const { particle: particleAlpha, line: lineAlpha } = alphaRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * particleAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          // 先用平方距离筛选，只有真正要画线的少数近邻才开方（画面完全一致，省掉上千次 sqrt）
          const distSq = dx * dx + dy * dy;
          if (distSq < LINK_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      if (!runningRef.current) return;
      draw();
      frameRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      frameRef.current = requestAnimationFrame(loop);
    };

    const stop = () => {
      runningRef.current = false;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    start();

    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, 150);
    };

    // 标签页切到后台就停下，不空转 CPU / 耗电
    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const handleMotionChange = (e) => {
      if (e.matches) stop();
      else start();
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery?.addEventListener?.('change', handleMotionChange);

    return () => {
      stop();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery?.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-0" />;
}
