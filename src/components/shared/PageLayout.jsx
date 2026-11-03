import { useGsapPageEnter } from '../../utils/gsapAnimations';

export default function PageLayout({ children, maxWidth = 'max-w-4xl' }) {
  const ref = useGsapPageEnter();
  return (
    <div className="min-h-screen page-backdrop transition-colors duration-300">
      <div ref={ref} className={`${maxWidth} mx-auto px-6 pt-28 pb-20`}>
        {children}
      </div>
    </div>
  );
}
