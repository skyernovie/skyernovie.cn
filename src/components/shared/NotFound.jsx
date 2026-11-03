import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCompass } from 'react-icons/fi';
import PageLayout from './PageLayout.jsx';

export default function NotFound({ title = '页面未找到', backTo = '/', backLabel = '返回首页' }) {
  return (
    <PageLayout>
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl liquid-glass flex items-center justify-center text-indigo-500">
          <FiCompass size={28} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">{title}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
          你访问的地址不存在，或者已经被移动了。
        </p>
        <Link to={backTo}
          className="inline-flex items-center gap-2 liquid-glass-light rounded-xl px-6 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-indigo-500 transition-all duration-300">
          <FiArrowLeft size={15} /> {backLabel}
        </Link>
      </div>
    </PageLayout>
  );
}
