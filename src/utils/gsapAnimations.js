import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export function useGsapPageEnter() {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { opacity: 0, scale: 0.96, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, { scope: ref.current });
  return ref;
}

export function useGsapSlideDown() {
  const ref = useRef(null);
  useGSAP(() => {
    gsap.fromTo(ref.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
  }, { scope: ref.current });
  return ref;
}

export function useGsapInView(delay = 0, duration = 0.6, y = 25) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 92%',
      onEnter: () => gsap.to(el, { autoAlpha: 1, y: 0, duration, delay, ease: 'power3.out' }),
      once: true,
    });
    return () => st.kill();
  }, { scope: ref.current, dependencies: [delay, duration, y] });
  return ref;
}

export function useGsapStaggerInView(stagger = 0.12, duration = 0.5, y = 30) {
  const containerRef = useRef(null);
  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = el.children;
    if (!children.length) return;
    gsap.set(children, { autoAlpha: 0, y, scale: 0.95 });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 90%',
      onEnter: () => gsap.to(children, { autoAlpha: 1, y: 0, scale: 1, duration, stagger, ease: 'power3.out', overwrite: 'auto' }),
      once: true,
    });
    return () => st.kill();
  }, { scope: containerRef.current, dependencies: [stagger, duration, y] });
  return containerRef;
}

export function useGsapPulse() {
  const ref = useRef(null);
  useGSAP(() => {
    const tween = gsap.to(ref.current, { scale: 1.06, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    return () => tween.kill();
  }, { scope: ref.current });
  return ref;
}
