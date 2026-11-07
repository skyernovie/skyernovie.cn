import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { EGG_EVENT } from '../utils/easterEgg';

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
  /* 彩蛋触发的流星串：存待生成的时间点，逐颗放出来 */
  const burstRef = useRef([]);
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

    /*
     * 流星：只在深色夜空出现。三色粒子（白 / 草绿 / 钻石青），尾迹更长、带像素光晕，
     * 基础频率比之前更密；彩蛋触发时再从 burstRef 里成串放出来。
     */
    const STAR_TINTS = ['233, 238, 247', '164, 240, 176', '132, 236, 226'];

    const spawnMeteor = (boost = 1) => {
      if (starsRef.current.length >= 30) return;
      const roll = Math.random();
      starsRef.current.push({
        x: width * 0.18 + Math.random() * width * 0.78,
        y: Math.random() * height * 0.35,
        vx: -(4.2 + Math.random() * 3.2) * boost,
        vy: (2.2 + Math.random() * 2) * boost,
        life: 0,
        max: 60 + Math.random() * 30,
        tail: 20 + Math.random() * 12,
        lineWidth: 1.6 + Math.random() * 0.8,
        tint: roll < 0.55 ? STAR_TINTS[0] : roll < 0.8 ? STAR_TINTS[1] : STAR_TINTS[2],
      });
    };

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

      if (darkRef.current) {
        if (time > nextStarRef.current) {
          nextStarRef.current = time + 2200 + Math.random() * 5000;
          spawnMeteor();
          if (Math.random() < 0.35) spawnMeteor();
        }

        /* 彩蛋流星串：时间到了就放一颗 */
        while (burstRef.current.length && burstRef.current[0] <= time) {
          burstRef.current.shift();
          spawnMeteor(1.35);
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
          const tailX = s.x - s.vx * s.tail;
          const tailY = s.y - s.vy * s.tail;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${s.tint}, ${(0.9 * fade).toFixed(3)})`);
          grad.addColorStop(0.45, `rgba(${s.tint}, ${(0.32 * fade).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${s.tint}, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.lineWidth;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          // 光晕：叠一个半透明方块，比 shadowBlur 便宜
          ctx.fillStyle = `rgba(${s.tint}, ${(0.14 * fade).toFixed(3)})`;
          ctx.fillRect(s.x - 3.5, s.y - 3.5, 7, 7);
          // 星头是一颗小方块，呼应整体像素语言
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.95 * fade).toFixed(3)})`;
          ctx.fillRect(s.x - 1, s.y - 1, 3, 3);
        }
      } else {
        burstRef.current.length = 0;
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

    /* 彩蛋触发：排 8 颗流星，每隔 90ms 放一颗，形成一小串 */
    const handleEggBurst = () => {
      if (!darkRef.current) return;
      const now = performance.now();
      for (let i = 0; i < 8; i += 1) {
        burstRef.current.push(now + i * 90);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener(EGG_EVENT, handleEggBurst);
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery?.addEventListener?.('change', handleMotionChange);

    return () => {
      stop();
      if (resizeTimer) clearTimeout(resizeTimer);
      burstRef.current.length = 0;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener(EGG_EVENT, handleEggBurst);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery?.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-0" />;
}
