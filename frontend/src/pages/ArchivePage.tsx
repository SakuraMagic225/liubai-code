import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getPublicArchiveData } from '../api/publicArticle';
import { TagBadge } from '../components/common/TagBadge';
import type { IArchiveData } from '../types';
import { formatDate } from '../utils/format';

const monthFormatter = new Intl.DateTimeFormat('zh-CN', { month: 'long' });

function formatMonth(year: number, month: number) {
  return monthFormatter.format(new Date(year, month - 1, 1));
}

export function ArchivePage() {
  const [archiveData, setArchiveData] = useState<IArchiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadArchive() {
      try {
        setLoading(true);
        const data = await getPublicArchiveData();
        if (!ignore) {
          setArchiveData(data);
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : '归档加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadArchive();

    return () => {
      ignore = true;
    };
  }, []);

  const archiveGroups = archiveData?.groups ?? [];
  const stats = archiveData?.stats ?? { articleCount: 0, yearCount: 0, tagCount: 0 };
  const firstYear = archiveGroups[archiveGroups.length - 1]?.year;
  const latestYear = archiveGroups[0]?.year;
  const yearRange = firstYear && latestYear ? `${firstYear} - ${latestYear}` : '持续更新';

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-green-100/70 bg-green-50/70 p-8 shadow-soft">
        <p className="text-sm font-medium text-coral-400">Archive</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-green-800">时间归档</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-green-600/85">
              所有已发布文章会按创建时间整理成时间轴，适合从一个阶段、一组主题或某次连续思考开始回看。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/80 bg-white/65 p-4">
              <span className="text-xs font-medium text-green-600/65">文章</span>
              <strong className="mt-2 block text-2xl text-green-800">{stats.articleCount}</strong>
            </div>
            <div className="rounded-lg border border-white/80 bg-white/65 p-4">
              <span className="text-xs font-medium text-green-600/65">年份</span>
              <strong className="mt-2 block text-2xl text-green-800">{stats.yearCount}</strong>
            </div>
            <div className="rounded-lg border border-white/80 bg-white/65 p-4">
              <span className="text-xs font-medium text-green-600/65">标签</span>
              <strong className="mt-2 block text-2xl text-green-800">{stats.tagCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
          正在加载归档...
        </div>
      ) : error ? (
        <div className="mt-8 rounded-lg border border-coral-100 bg-coral-50/70 p-8 text-coral-600">{error}</div>
      ) : archiveGroups.length === 0 ? (
        <div className="mt-8 rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
          暂无已发布文章。发布文章后，这里会自动生成归档。
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <main className="min-w-0 space-y-8">
            {archiveGroups.map((yearGroup) => (
              <section key={yearGroup.year} id={`year-${yearGroup.year}`} className="scroll-mt-28">
                <div className="mb-5 flex items-end justify-between border-b border-green-100/70 pb-4">
                  <div>
                    <p className="text-sm font-medium text-coral-400">{yearGroup.year}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-green-800">{yearGroup.year} 年</h2>
                  </div>
                  <span className="text-sm text-green-600/65">
                    {yearGroup.months.reduce((sum, month) => sum + month.articles.length, 0)} 篇
                  </span>
                </div>

                <div className="space-y-6">
                  {yearGroup.months.map((monthGroup) => (
                    <div
                      key={`${yearGroup.year}-${monthGroup.month}`}
                      id={`month-${yearGroup.year}-${monthGroup.month}`}
                      className="grid gap-5 scroll-mt-28 rounded-lg border border-green-100/70 bg-white/80 p-6 shadow-soft lg:grid-cols-[120px_minmax(0,1fr)]"
                    >
                      <div>
                        <p className="text-sm font-medium text-coral-400">{formatMonth(yearGroup.year, monthGroup.month)}</p>
                        <p className="mt-2 text-sm text-green-600/65">{monthGroup.articles.length} 篇文章</p>
                      </div>

                      <div className="relative space-y-5 pl-5 before:absolute before:left-0 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-green-100">
                        {monthGroup.articles.map((article) => (
                          <article
                            key={article.id}
                            className="group relative rounded-lg border border-transparent p-4 transition duration-200 hover:-translate-y-0.5 hover:border-coral-100 hover:bg-coral-50/40"
                          >
                            <span className="absolute -left-[23px] top-6 h-3 w-3 rounded-full border-2 border-white bg-green-200 group-hover:bg-coral-400" />
                            <div className="flex flex-wrap items-center gap-3 text-xs text-green-600/65">
                              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                              <span>{article.readMinutes} 分钟阅读</span>
                            </div>
                            <Link
                              to={`/articles/${article.id}`}
                              className="mt-2 block text-xl font-semibold leading-snug text-green-800 hover:text-coral-600"
                            >
                              {article.title}
                            </Link>
                            <p className="mt-3 line-clamp-2 text-sm leading-7 text-green-600/80">{article.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {article.tags.map((item) => (
                                <TagBadge key={item} name={item} />
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>

          <aside className="space-y-5 lg:sticky lg:top-28">
            <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
              <p className="text-sm font-medium text-coral-400">Index</p>
              <h2 className="mt-2 text-lg font-semibold text-green-800">归档索引</h2>
              <p className="mt-3 text-sm leading-6 text-green-600/75">当前收录 {yearRange} 的写作记录。</p>
              <nav className="mt-5 space-y-4 text-sm">
                {archiveGroups.map((yearGroup) => (
                  <div key={yearGroup.year}>
                    <a href={`#year-${yearGroup.year}`} className="font-semibold text-green-800 hover:text-coral-600">
                      {yearGroup.year}
                    </a>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {yearGroup.months.map((monthGroup) => (
                        <a
                          key={`${yearGroup.year}-${monthGroup.month}`}
                          href={`#month-${yearGroup.year}-${monthGroup.month}`}
                          className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
                        >
                          {monthGroup.month} 月
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
