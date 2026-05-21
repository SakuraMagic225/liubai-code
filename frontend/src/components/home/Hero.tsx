import { Link } from 'react-router-dom';

import type { IArticleSummary } from '../../types';
import { formatDate } from '../../utils/format';
import { TagBadge } from '../common/TagBadge';

interface HeroProps {
  article: IArticleSummary;
}

export function Hero({ article }: HeroProps) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-lg border border-green-100/60 bg-green-50/70 px-6 py-8 shadow-soft sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-white/35" aria-hidden="true" />
      <div className="relative grid min-w-0 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="min-w-0">
          <p className="text-sm font-medium text-coral-400">Featured Article</p>
          <h1 className="mt-4 max-w-3xl break-words text-3xl font-semibold leading-tight text-green-800 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl break-words text-base leading-8 text-green-600/90">
            {article.summary}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-green-600/75">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span>{article.readMinutes} 分钟阅读</span>
          </div>
        </div>

        <div className="glass-card min-w-0 rounded-lg p-5">
          <p className="text-sm font-medium text-green-800">文章标签</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <TagBadge key={tag} name={tag} />
            ))}
          </div>
          <Link
            to={`/articles/${article.id}`}
            className="mt-6 inline-flex rounded-full bg-coral-400 px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.03] hover:bg-coral-600 active:scale-[0.97]"
          >
            阅读这篇
          </Link>
        </div>
      </div>
    </section>
  );
}
