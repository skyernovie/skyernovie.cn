import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

/*
 * 像素孢子背景：漂浮的小方块，像空气里的经验粒子 / 孢子。
 * 三色矿石调色板（草绿为主、钻石青点缀、少量金），单个粒子带闪烁相位。
 * 刻意不画粒子间连线——圆点+连线是模板标配，方块孢子才是 MC 的味道。
 */
const PALETTE = [
  { rgb: '95, 208, 104', weight: 0.62 }, // 草绿
  { rgb: '79, 224, 208', weight: 0.26 }, // 钻石青
  { rgb: '245, 197, 66', weight: 0.12 }, // 金
];

function pickColor() {
  const roll = Math.random();
  let acc = 0;
  for (const c of PALETTE) {
    acc += c.weight;
    if (roll <= acc) return c.rgb;
  }
  return PALETTE[0].rgb;
}

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // 2–4px 的小方块，大小带层级
    this.size = Math.random() < 0.7 ? 2 : Math.random() < 0.85 ? 3 : 4;
    this.speedX = (Math.random() - 0.5) * 0.24;
    this.speedY = (Math.random() - 0.5) * 0.24;
    this.baseOpacity = Math.random() * 0.32 + 0.12;
    this.phase = Math.random() * Math.PI * 2;
    this.twinkle = Math.random() * 0.0012 + 0.0004;
    this.color = pickColor();
  }

  update(width, height) {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  opacityAt(time) {
    return this.baseOpacity * (0.55 + 0.45 * Math.sin(time * this.twinkle + this.phase));
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const starsRef = useRef([]);
  const nextStarRef = useRef(0);
  const frameRef = useRef(null);
  const runningRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // 颜色强度放进 ref，主题切换时只改数值，不重启动画循环
  const alphaRef = useRef(isDark ? 0.85 : 0.55);
  const darkRef = useRef(isDark);

  useEffect(() => {
    alphaRef.current = isDark ? 0.85 : 0.55;
    darkRef.current = isDark;
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

    // 粒子数量按面积算，手机等窄屏再降一档，避免小屏耗电
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const count = coarse ? 28 : Math.min(Math.round((width * height) / 26000), 72);
    particlesRef.current = Array.from({ length: count }, () => new Particle(width, height));

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const alpha = alphaRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height);
        ctx.fillStyle = `rgba(${p.color}, ${(p.opacityAt(time) * alpha).toFixed(3)})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // 流星：只在深色夜空出现，每 5–14 秒一颗，划过左上到右下，带渐隐尾迹
      if (darkRef.current) {
        if (time > nextStarRef.current) {
          nextStarRef.current = time + 5000 + Math.random() * 9000;
          starsRef.current.push({
            x: width * 0.25 + Math.random() * width * 0.7,
            y: Math.random() * height * 0.35,
            vx: -(3.5 + Math.random() * 2.5),
            vy: 2 + Math.random() * 1.6,
            life: 0,
            max: 55 + Math.random() * 25,
          });
        }

        const stars = starsRef.current;
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i];
          s.life++;
          s.x += s.vx;
          s.y += s.vy;
          if (s.life >= s.max || s.x < -80 || s.y > height + 80) {
            stars.splice(i, 1);
            continue;
          }
          // 正弦包络：淡入再淡出，不会突然出现/消失
          const fade = Math.sin((s.life / s.max) * Math.PI);
          const tailX = s.x - s.vx * 16;
          const tailY = s.y - s.vy * 16;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(233, 238, 247, ${(0.75 * fade).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(233, 238, 247, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          // 星头是一颗小方块，呼应整体像素语言
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * fade).toFixed(3)})`;
          ctx.fillRect(s.x - 1, s.y - 1, 2.5, 2.5);
        }
      }
    };

    const loop = (time) => {
      if (!runningRef.current) return;
      draw(time);
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
