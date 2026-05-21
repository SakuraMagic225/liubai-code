import { useEffect, useState } from 'react';

import { getPublicHomeData } from '../api/publicArticle';
import { ArticleList } from '../components/article/ArticleList';
import { Hero } from '../components/home/Hero';
import { ProfileCard } from '../components/home/ProfileCard';
import { StatsBar } from '../components/home/StatsBar';
import { TagCloud } from '../components/home/TagCloud';
import { profile } from '../mocks/home';
import type { IHomeData } from '../types';

export function HomePage() {
  const [homeData, setHomeData] = useState<IHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        const data = await getPublicHomeData();
        if (!ignore) {
          setHomeData(data);
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '首页数据加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadHomeData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
      {loading ? (
        <section className="rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
          正在加载首页内容...
        </section>
      ) : error ? (
        <section className="rounded-lg border border-coral-100 bg-coral-50/70 p-8 text-coral-600">
          {error}
        </section>
      ) : homeData?.featuredArticle ? (
        <Hero article={homeData.featuredArticle} />
      ) : (
        <section className="rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
          暂无已发布文章。你可以先在后台新建并发布一篇文章。
        </section>
      )}

      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <ArticleList articles={homeData?.latestArticles ?? []} />

        <div className="space-y-5 lg:sticky lg:top-28">
          <ProfileCard profile={profile} />
          <StatsBar stats={homeData?.stats ?? { articleCount: 0, tagCount: 0, viewCount: 0 }} />
          <TagCloud tags={homeData?.tags ?? []} />
        </div>
      </div>
    </div>
  );
}
