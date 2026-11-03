import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FiArrowUp } from 'react-icons/fi';

export default function ScrollToTopFab() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      autoAlpha: visible ? 1 : 0,
      scale: visible ? 1 : 0.5,
      duration: 0.35,
      ease: 'power3.out',
      pointerEvents: visible ? 'auto' : 'none',
    });
  }, { scope: btnRef, dependencies: [visible] });

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 sm:right-8 z-50 glass-effect rounded-full w-12 h-12 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-indigo-500 transition-colors shadow-lg"
      style={{ opacity: 0, pointerEvents: 'none' }}
      aria-label="返回顶部"
    >
      <FiArrowUp size={18} />
    </button>
  );
}
