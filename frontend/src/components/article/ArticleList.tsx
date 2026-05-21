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
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="min-h-[190px] rounded-lg border border-dashed border-green-100 bg-white/70 p-6 shadow-soft">
            <div className="flex h-full min-h-[142px] flex-col justify-center">
              <p className="text-sm font-medium text-coral-400">Coming soon</p>
              <h3 className="mt-3 text-xl font-semibold text-green-800">还没有已发布文章</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-green-600/80">
                在后台把文章状态切换为“已发布”后，它会自动出现在这里。现在先给这一块留一点呼吸感。
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
