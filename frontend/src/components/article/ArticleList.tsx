import type { IArticleSummary } from '../../types';
import { ArticleCard } from './ArticleCard';

interface ArticleListProps {
  articles: IArticleSummary[];
  title?: string;
  kicker?: string;
}

export function ArticleList({ articles, title = '最新文章', kicker = 'Latest' }: ArticleListProps) {
  return (
    <section aria-labelledby="latest-articles" className="space-y-5">
      <div>
        <p className="text-sm font-medium text-coral-400">{kicker}</p>
        <h2 id="latest-articles" className="mt-2 text-2xl font-semibold text-green-800">
          {title}
        </h2>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
