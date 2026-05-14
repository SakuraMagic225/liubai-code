import { Link } from 'react-router-dom';

import type { IArticleSummary } from '../../types';
import { formatDate } from '../../utils/format';
import { TagBadge } from '../common/TagBadge';

interface ArticleCardProps {
  article: IArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link to={`/articles/${article.id}`} className="block">
      <article className="group min-w-0 rounded-lg border border-green-100/70 bg-white/80 p-5 shadow-soft transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:border-coral-400 hover:bg-white">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-green-600/70">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <span>{article.readMinutes} 分钟阅读</span>
        </div>

        <h3 className="break-words text-lg font-semibold leading-snug text-green-800 group-hover:text-coral-600">
          {article.title}
        </h3>

        <p className="mt-3 break-words text-sm leading-7 text-green-600/85">{article.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <TagBadge key={tag} name={tag} />
          ))}
        </div>
      </article>
    </Link>
  );
}
