import { ArticleList } from '../components/article/ArticleList';
import { Hero } from '../components/home/Hero';
import { ProfileCard } from '../components/home/ProfileCard';
import { StatsBar } from '../components/home/StatsBar';
import { TagCloud } from '../components/home/TagCloud';
import { featuredArticle, homeStats, latestArticles, profile, tags } from '../mocks/home';

export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Hero article={featuredArticle} />

      <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <ArticleList articles={latestArticles} />

        <div className="space-y-5 lg:sticky lg:top-28">
          <ProfileCard profile={profile} />
          <StatsBar stats={homeStats} />
          <TagCloud tags={tags} />
        </div>
      </div>
    </div>
  );
}
