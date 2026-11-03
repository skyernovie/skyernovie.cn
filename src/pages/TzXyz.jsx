import { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';
import { FiExternalLink, FiMessageCircle, FiUsers, FiClock, FiPlayCircle, FiStar, FiThumbsUp, FiTrendingUp, FiEye } from 'react-icons/fi';
import { SiBilibili } from 'react-icons/si';
import AnimatedLink from '../components/shared/AnimatedLink';
import statsData from '../data/stats.json';

gsap.registerPlugin(ScrollTrigger);

/*
 * 粉丝数不是写死的：scripts/fetch-stats.mjs 会把 B 站的真实粉丝数抓进 src/data/stats.json，
 * 部署前跑一次 npm run sync:stats 即可更新（CI 里也会自动跑）。
 */
const FAN_TEXT =
  statsData.follower >= 10000
    ? `${(statsData.follower / 10000).toFixed(2)}万`
    : statsData.follower.toLocaleString('en-US');
const FAN_TITLE = `${statsData.follower.toLocaleString('en-US')} 位粉丝${
  statsData.updatedAt ? `（更新于 ${statsData.updatedAt}）` : ''
}`;

const WORKER_URL = 'https://api.zhcool520.xyz';

const TD_MILESTONES = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

const TD_MSG = {
  10: '不错哦~继续！',
  50: '手速可以啊！',
  100: '💯 百发百中！',
  200: '停不下来了是吧',
  500: '🔥 燃起来了！',
  1000: '🎉 千锤百炼！',
  2000: '你是认真的吗',
  5000: '⭐ 大佬受我一拜',
  10000: '🏆 万中无一！',
  20000: '二万五千里长征',
  50000: '👑 五万封顶?不存在的',
  100000: '💎 十万！传说级！',
};

function TdButton() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('tz_td_count_backup');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [clicks, setClicks] = useState([]);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(false);
  const wrapperRef = useRef(null);
  const countRef = useRef(0);
  const clickId = useRef(0);

  const syncCount = useCallback((v) => {
    countRef.current = v;
    setCount(v);
    localStorage.setItem('tz_td_count_backup', v.toString());
  }, []);

  const checkMilestone = useCallback((prev, next) => {
    for (const m of TD_MILESTONES) {
      if (prev < m && next >= m && TD_MSG[m]) {
        setToast(TD_MSG[m]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${WORKER_URL}/get?_t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        if (data.value !== undefined) {
          const serverVal = data.value;
          countRef.current = Math.max(countRef.current, serverVal);
          setCount(countRef.current);
          localStorage.setItem('tz_td_count_backup', countRef.current.toString());
          setError(false);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('tz_td_count_backup');
        if (saved) syncCount(parseInt(saved, 10));
        setError(true);
      });
  }, [syncCount]);

  // Clean up particles
  useEffect(() => {
    if (clicks.length === 0) return;
    const timer = setTimeout(() => setClicks(prev => prev.slice(1)), 800);
    return () => clearTimeout(timer);
  }, [clicks]);

  // Clean up toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleTd = useCallback((e) => {
    const id = ++clickId.current;
    const rect = wrapperRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);

    const prev = countRef.current;
    const next = prev + 1;
    countRef.current = next;
    setCount(next);
    checkMilestone(prev, next);
    setClicks(prev => [...prev.slice(-8), { id, x, y }]);

    fetch(`${WORKER_URL}/hit?_t=${Date.now()}`, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.value !== undefined) {
          countRef.current = Math.max(countRef.current, data.value);
          setCount(countRef.current);
          localStorage.setItem('tz_td_count_backup', countRef.current.toString());
          setError(false);
        }
      })
      .catch(() => setError(true));
  }, [checkMilestone, syncCount]);

  const display = count.toLocaleString('zh-CN');

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      {/* 粒子层 — 在按钮外面，不被裁剪 */}
      {clicks.map(c => (
        <span key={c.id}
          className="absolute w-1 h-1 rounded-full bg-rose-400/60 pointer-events-none z-50"
          style={{ left: c.x, top: c.y, animation: 'td-ripple 0.5s ease-out forwards' }}
        />
      ))}
      {clicks.map(c => (
        <span key={`p-${c.id}`}
          className="absolute pointer-events-none text-rose-500 font-bold text-sm z-50"
          style={{ left: c.x, top: c.y, animation: 'td-float 0.8s ease-out forwards' }}>
          +1
        </span>
      ))}

      {/* 里程碑对话气泡 */}
      {toast && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-bounce">
          <span className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-lg whitespace-nowrap">
            {toast}
          </span>
        </div>
      )}

      <button
        onClick={handleTd}
        title={error ? '同步中...' : '猛戳 TD！'}
        className={`tz-hero-btn relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 liquid-glass-light
          ${error ? 'text-amber-500' : 'text-neutral-600 dark:text-neutral-300'}
          hover:scale-110 hover:shadow-xl hover:shadow-rose-500/20 hover:text-rose-500 hover:bg-rose-500/15 hover:-translate-y-1 active:scale-95 active:duration-75`}>
        <FiThumbsUp size={16} className="relative group-hover:scale-110 transition-transform duration-200" />
        <span className="relative">TD</span>
        <span className="relative text-xs font-mono tabular-nums">
          {display}
        </span>
        {error && <span className="relative w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
      </button>

      <style>{`
        @keyframes td-ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(30); opacity: 0; }
        }
        @keyframes td-float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-28px) scale(1.4); opacity: 0.9; }
          100% { transform: translateY(-52px) scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const socialLinks = [
  { icon: SiBilibili, label: 'B站主页', url: 'https://space.bilibili.com/25770857', color: 'hover:bg-[#FB7299]/20 hover:text-[#FB7299]' },
  { icon: FiExternalLink, label: '直播间', url: 'https://live.bilibili.com/303427', color: 'hover:bg-orange-500/20 hover:text-orange-500' },
  { icon: FiMessageCircle, label: 'QQ群', url: 'https://qm.qq.com/q/xa0u5yocV4', color: 'hover:bg-teal-500/20 hover:text-teal-500' },
  { icon: FiExternalLink, label: '抖音', url: 'https://v.douyin.com/TCPDQ1sFpEA/', color: 'hover:bg-neutral-800/20 hover:text-neutral-800 dark:hover:text-white' },
];

const featuredItems = [
  { title: '蒸汽合金炉合出创造能源？开启AE2！格雷空岛爽包Ep1', desc: '格雷科技空岛整合包实况，蒸汽合金炉开启创造能源，全面启动AE2自动化！', image: '/images/video1.webp', url: 'https://www.bilibili.com/video/BV1mdCTBgEjZ', views: '16.0万', tag: '格雷科技' },
  { title: '模块化巅峰神包！开局送AE，做出创造飞行！新星工程EP1', desc: '模块化巅峰整合包实况，开局赠送AE系统，一步到位做出创造飞行！', image: '/images/video2.webp', url: 'https://www.bilibili.com/video/BV1tWVh6NEtz', views: '7.7万', tag: '模块化' },
  { title: '资源蜜蜂版无中生有 开局送创造马达！蜂蜂空坊Ep1', desc: '蜜蜂版无中生有整合包实况，开局赠送创造马达，开启蜂蜂空坊全新系列冒险！', image: '/images/video3.webp', url: 'https://www.bilibili.com/video/BV1xeSRBpEt9', views: '6.1万', tag: '蜜蜂空岛' },
];

const collectionItems = [
  { title: '新时代科技', desc: '高版本轮椅模组整合爽包，开局送AE一路爽到创造飞行，全6集完结。', image: '/images/collection1.jpg', url: 'https://space.bilibili.com/25770857/channel/collectiondetail?sid=8816969', views: '34.5万', tag: '视频合集 · 全6集' },
  { title: '无限遗产', desc: '无限遗产II私货版，AE与创造蜜蜂一路爽飞，全6集完结。', image: '/images/collection2.jpg', url: 'https://space.bilibili.com/25770857/channel/collectiondetail?sid=9154355', views: '30.6万', tag: '视频合集 · 全6集' },
];

const showcaseItems = [...featuredItems, ...collectionItems];

const downloadItems = [
  { icon: '💬', title: '催更①群', desc: 'Minecraft模组交流，催更讨论。', btnLabel: '已满员', btnColor: 'bg-neutral-400', url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=X1wN9HgYwSiPQoTOfFeQCIsvv1tJP1aR&authKey=Qvpoj8yGRb9KuEdyCHKj7uKe7ZmuQqphmvAoAIrDBGNgAX6BxVGB1wP1%2FGairuyE&noverify=0&group_code=768587905', code: '768587905', status: '已满员', statusColor: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400', disabled: true },
  { icon: '💬', title: '催更②群', desc: '粉丝交流②群，更多讨论空间。', btnLabel: '已满员', btnColor: 'bg-neutral-400', url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mDc4o5DA6jJimZ_uR7wrN8VLq5NqClfJ&authKey=%2BV64u1ibJD5Ww%2FeEpxbajM%2FSgMfrmmYYaX9OBtlBanx%2FhaPSSCLsB4c17hEwLWP9&noverify=0&group_code=564472763', code: '564472763', status: '已满员', statusColor: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400', disabled: true },
  { icon: '💬', title: '催更③群', desc: '③群已满，欢迎加入④群。', btnLabel: '已满员', btnColor: 'bg-neutral-400', url: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=o56dxRJfYHO8TN-XI5RdYip0Ofc5tP6x&authKey=hAw3ZnvNAsK51XCYi3ImJdxJtMmqzm2Lel%2BXjXekjlmshwnq8qHmMeAzyfhFUATJ&noverify=0&group_code=694474933', code: '694474933', status: '已满员', statusColor: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400', disabled: true },
  { icon: '💬', title: '催更④群', desc: '新群开放中，欢迎加入！', btnLabel: '加入群聊', btnColor: 'bg-emerald-500 hover:bg-emerald-600', url: 'https://qm.qq.com/q/xa0u5yocV4', status: '开放加入', statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
  { icon: '📡', title: 'QQ频道', desc: '获取最新动态、直播通知和独家内容。', btnLabel: '加入频道', btnColor: 'bg-sky-500 hover:bg-sky-600', url: 'https://pd.qq.com/s/pd39356778', code: 'pd39356778', status: '官方频道', statusColor: 'text-sky-600 bg-sky-50 dark:bg-sky-900/30' },
];

export default function TzXyz() {
  const pageRef = useRef(null);

  useGSAP(() => {
    document.title = '天真SkyerNovie - 个人主页';
    return () => { document.title = '天真SkyerNovie'; };
  }, { scope: pageRef });

  useGSAP(() => {
    const el = pageRef.current;
    if (!el) return;
    const triggers = [];
    const BASE_DURATION = 0.6;
    const STAGGER_DELAY = 0.12;

    // Hero 入场动画 - 统一弹性效果
    const hero = el.querySelector('.tz-hero');
    if (hero) {
      gsap.fromTo(hero, 
        { autoAlpha: 0, y: 50, scale: 0.9, rotateX: -10 }, 
        { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1, ease: 'power3.out' }
      );
      
      // 社交按钮依次入场 - 统一动画
      const btns = el.querySelectorAll('.tz-hero-btn');
      gsap.fromTo(btns, 
        { autoAlpha: 0, y: 25, scale: 0.75, rotate: -5 }, 
        { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: BASE_DURATION, stagger: STAGGER_DELAY, delay: 0.4, ease: 'back.out(1.5)' }
      );
    }

    // 统计卡片动画 - 增强缩放和延迟
    const statCards = el.querySelectorAll('.tz-stat-card');
    if (statCards.length) {
      gsap.set(statCards, { autoAlpha: 0, y: 40, scale: 0.85, rotateX: 15 });
      triggers.push(ScrollTrigger.create({
        trigger: statCards[0], start: 'top 85%',
        onEnter: () => gsap.to(statCards, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: BASE_DURATION, stagger: STAGGER_DELAY, ease: 'back.out(1.3)' }),
        once: true
      }));
    }

    // 视频标题动画 - 统一缓动
    const videoTitle = el.querySelector('.tz-video-title');
    if (videoTitle) {
      gsap.set(videoTitle, { autoAlpha: 0, y: 50, scale: 0.95 });
      triggers.push(ScrollTrigger.create({
        trigger: videoTitle, start: 'top 85%',
        onEnter: () => gsap.to(videoTitle, { autoAlpha: 1, y: 0, scale: 1, duration: BASE_DURATION, ease: 'power3.out' }),
        once: true
      }));
    }

    // 视频卡片动画 - 交错入场，增强效果
    const videoCards = el.querySelectorAll('.tz-video-card');
    if (videoCards.length) {
      gsap.set(videoCards, { autoAlpha: 0, y: 60, scale: 0.8, rotateY: -15 });
      triggers.push(ScrollTrigger.create({
        trigger: videoCards[0], start: 'top 85%',
        onEnter: () => gsap.to(videoCards, { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, duration: BASE_DURATION + 0.1, stagger: STAGGER_DELAY + 0.03, ease: 'power3.out' }),
        once: true
      }));
    }

    // 资源导航动画 - 统一风格
    const resSection = el.querySelector('.tz-resources-section');
    if (resSection) {
      gsap.set(resSection, { autoAlpha: 0, y: 40, scale: 0.95 });
      triggers.push(ScrollTrigger.create({
        trigger: resSection, start: 'top 85%',
        onEnter: () => gsap.to(resSection, { autoAlpha: 1, y: 0, scale: 1, duration: BASE_DURATION, ease: 'power3.out' }),
        once: true
      }));
    }

    // 社区标题动画 - 统一风格
    const comTitle = el.querySelector('.tz-com-title');
    if (comTitle) {
      gsap.set(comTitle, { autoAlpha: 0, y: 40, scale: 0.95 });
      triggers.push(ScrollTrigger.create({
        trigger: comTitle, start: 'top 85%',
        onEnter: () => gsap.to(comTitle, { autoAlpha: 1, y: 0, scale: 1, duration: BASE_DURATION, ease: 'power3.out' }),
        once: true
      }));
    }

    // 社区卡片动画 - 增强效果
    const comCards = el.querySelectorAll('.tz-com-card');
    if (comCards.length) {
      gsap.set(comCards, { autoAlpha: 0, y: 50, scale: 0.85, rotateX: 10 });
      triggers.push(ScrollTrigger.create({
        trigger: comCards[0], start: 'top 85%',
        onEnter: () => gsap.to(comCards, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: BASE_DURATION, stagger: STAGGER_DELAY, ease: 'back.out(1.3)' }),
        once: true
      }));
    }

    // 联系区域动画 - 统一风格
    const contactSection = el.querySelector('.tz-contact-section');
    if (contactSection) {
      gsap.set(contactSection, { autoAlpha: 0, y: 40, scale: 0.95 });
      triggers.push(ScrollTrigger.create({
        trigger: contactSection, start: 'top 85%',
        onEnter: () => gsap.to(contactSection, { autoAlpha: 1, y: 0, scale: 1, duration: BASE_DURATION, ease: 'power3.out' }),
        once: true
      }));
    }

    return () => { triggers.forEach(st => st.kill()); };
  }, { scope: pageRef });

  return (
    <div ref={pageRef} className="min-h-screen page-backdrop">
      <Helmet>
        <title>天真SkyerNovie - 个人主页</title>
        <meta name="description" content="天真SkyerNovie 的个人主页 - Minecraft 游戏视频创作者，整合包推荐，粉丝社区互动。" />
        <link rel="canonical" href="https://skyernovie.cn/" />
        <meta property="og:title" content="天真SkyerNovie - 个人主页" />
        <meta property="og:description" content="Minecraft 游戏视频创作者，整合包推荐，粉丝社区互动" />
        <meta property="og:url" content="https://skyernovie.cn/" />
        <meta property="og:image" content="https://skyernovie.cn/images/avatar.webp" />
        <meta name="twitter:title" content="天真SkyerNovie - 个人主页" />
        <meta name="twitter:description" content="Minecraft 游戏视频创作者，整合包推荐，粉丝社区互动" />
      </Helmet>

      {/* Hero Section - 个人信息 */}
      <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-6">
        <div className="relative max-w-5xl mx-auto">
          <div className="tz-hero liquid-glass rounded-3xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
              {/* 头像 */}
              <div className="relative">
                <div className="absolute inset-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-xl animate-pulse" />
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-white/50 dark:ring-white/20 shadow-2xl hover:scale-105 transition-transform duration-500">
                  <img src="/images/avatar.webp" alt="天真SkyerNovie" className="w-full h-full object-cover" decoding="async" />
                </div>
              </div>
              
              {/* 信息 */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                  <span className="gradient-text">天真SkyerNovie</span>
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg text-sm sm:text-base mb-6">
                  Minecraft实况主 · 模组游戏达人 · 每晚8点-10点直播
                  <br className="hidden sm:block" />
                  <span className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">特殊情况可能暂停，详见B站动态或QQ群通知</span>
                </p>
                
                {/* 社交链接 */}
                <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                  {socialLinks.map((link, i) => (
                    <AnimatedLink key={i} 
                      className={`tz-hero-btn relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-glass-light text-sm font-medium transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 ${link.color}`}
                      href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon size={18} className="transition-transform duration-300 hover:scale-110" /><span>{link.label}</span>
                    </AnimatedLink>
                  ))}
                  <TdButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-8 sm:py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="tz-stat-card liquid-glass-light rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1">
              <FiUsers className="mx-auto mb-3 text-indigo-500 transition-transform duration-300 hover:scale-110" size={28} />
              <div className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-50" title={FAN_TITLE}>{FAN_TEXT}</div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">B站粉丝</div>
            </div>
            <div className="tz-stat-card liquid-glass-light rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1">
              <FiPlayCircle className="mx-auto mb-3 text-emerald-500 transition-transform duration-300 hover:scale-110" size={28} />
              <div className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-50">《格雷空岛》</div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">主要系列</div>
            </div>
            <div className="tz-stat-card liquid-glass-light rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1">
              <FiClock className="mx-auto mb-3 text-amber-500 transition-transform duration-300 hover:scale-110" size={28} />
              <div className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-50">3天/期</div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">更新频率</div>
            </div>
            <div className="tz-stat-card liquid-glass-light rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:-translate-y-1">
              <FiTrendingUp className="mx-auto mb-3 text-rose-500 transition-transform duration-300 hover:scale-110" size={28} />
              <div className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-50">整合包实况</div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">核心领域</div>
            </div>
          </div>
        </div>
      </section>

      {/* 精选视频 */}
      <section id="tz-video" className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="tz-video-title text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-neutral-50 mb-4">精选视频</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">Minecraft 模组实况与系列合集，持续更新中</p>
            <div className="w-32 h-1 mx-auto mt-6 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcaseItems.map((item, i) => (
              <a key={i} 
                className="tz-video-card liquid-glass rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300"
                href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="relative overflow-hidden aspect-video">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" decoding="async" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                        <FiPlayCircle className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  {/* 标签 */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                    {item.tag}
                  </div>
                  {/* 播放量 */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs">
                    <FiEye size={14} /><span>{item.views}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-2 group-hover:text-indigo-500 transition-colors text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-2 line-clamp-2">{item.desc}</p>
                </div>
              </a>
            ))}
            
            {/* 查看更多 */}
            <a 
              className="tz-video-card liquid-glass-light rounded-2xl flex flex-col items-center justify-center gap-4 py-10 sm:py-12 group cursor-pointer hover:scale-[1.02] transition-all duration-300"
              href="https://space.bilibili.com/25770857" target="_blank" rel="noopener noreferrer">
              <div className="relative">
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/40 group-hover:scale-150 transition-all duration-500" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <FiExternalLink size={36} />
                </div>
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-1">查看更多视频</span>
                <span className="block text-xs text-neutral-400 dark:text-neutral-500">前往B站空间发现更多精彩</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 整合包资源导航 */}
      <section className="tz-resources-section py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-50 mb-4">整合包资源导航</h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
            由于模组授权协议原因，本站不直接提供整合包文件。视频里用到的整合包，都可以在下面几个平台找到。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="https://www.mcmod.cn/modpack.html" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">MC百科</a>
            <a href="https://www.curseforge.com/minecraft/modpacks" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">CurseForge</a>
            <a href="https://modrinth.com/modpacks" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">Modrinth</a>
          </div>
        </div>
      </section>

      {/* 粉丝社区 */}
      <section id="tz-community" className="py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="tz-com-title text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-neutral-50 mb-4">粉丝社区</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">加入粉丝群，获取最新开播和更新通知</p>
            <div className="w-32 h-1 mx-auto mt-6 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-5">
            {downloadItems.map((item, i) => (
              <div key={i} className={`tz-com-card liquid-glass rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 ${item.disabled ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl liquid-glass-light flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-neutral-800 dark:text-neutral-100 text-sm sm:text-base">{item.title}</h3>
                      {item.status && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusColor}`}>{item.status}</span>}
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mb-3">{item.desc}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.code && <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100/80 dark:bg-neutral-800/80 px-3 py-1.5 rounded-lg">{item.code}</span>}
                      {item.disabled ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-200/80 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed">
                          <FiUsers size={12} /><span>{item.btnLabel}</span>
                        </span>
                      ) : (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" 
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-105 ${item.btnColor} text-white`}>
                          <FiExternalLink size={12} /><span>{item.btnLabel}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center mt-10 text-xs sm:text-sm text-neutral-400 dark:text-neutral-500">
            每晚8点-10点直播 · 特殊情况可能暂停，详见B站动态或QQ群
          </p>
        </div>
      </section>

      {/* 联系方式 */}
      <section id="tz-contact" className="tz-contact-section py-16 sm:py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-50 mb-4">与我联系</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base mb-8">直播通知 · 催更讨论 · 商务合作</p>
          <div className="w-32 h-1 mx-auto mb-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />
          
          <div className="grid sm:grid-cols-2 gap-4">
            <a href="https://space.bilibili.com/25770857" target="_blank" rel="noopener noreferrer"
              className="liquid-glass rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
              <SiBilibili className="text-[#FB7299]" size={28} />
              <div>
                <div className="font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-[#FB7299] transition-colors">B站私信</div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500">商务合作首选</div>
              </div>
            </a>
            <a href="https://qm.qq.com/q/xa0u5yocV4" target="_blank" rel="noopener noreferrer"
              className="liquid-glass rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 group">
              <FiMessageCircle className="text-teal-500" size={28} />
              <div>
                <div className="font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-teal-500 transition-colors">QQ群</div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500">粉丝交流互动</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}