import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPublicArticleDetail } from '../api/publicArticle';
import { MarkdownRenderer } from '../components/article/MarkdownRenderer';
import { TagBadge } from '../components/common/TagBadge';
import type { IArticleDetail } from '../types';
import { formatDate } from '../utils/format';
import { extractMarkdownHeadings } from '../utils/markdown';

export function ArticleDetailPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const [article, setArticle] = useState<IArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      if (!Number.isFinite(articleId)) {
        setArticle(null);
        setError('文章不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPublicArticleDetail(articleId);
        if (!ignore) {
          setArticle({
            ...data,
            headings: extractMarkdownHeadings(data.content ?? ''),
          });
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setArticle(null);
          setError(err instanceof Error ? err.message : '文章加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      ignore = true;
    };
  }, [articleId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
          正在加载文章...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-green-100/70 bg-white/80 p-8">
          <p className="text-sm font-medium text-coral-400">Article</p>
          <h1 className="mt-3 text-3xl font-semibold text-green-800">文章不存在</h1>
          <p className="mt-4 text-green-600/80">
            {error || '这篇文章可能还未发布，或已经被移动。'}
          </p>
          <Link
            to="/articles"
            className="mt-6 inline-flex rounded-full bg-coral-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-600"
          >
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <main className="min-w-0">
          <header className="rounded-lg border border-green-100/70 bg-green-50/70 p-8 shadow-soft">
            <Link to="/articles" className="text-sm font-medium text-coral-400 hover:text-coral-600">
              返回文章列表
            </Link>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-green-800">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-green-600/90">{article.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-green-600/75">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              <span>{article.readMinutes} 分钟阅读</span>
              <span>{article.viewCount?.toLocaleString('zh-CN') ?? 0} 次阅读</span>
              <span>更新于 {formatDate(article.updatedAt)}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <TagBadge key={tag} name={tag} />
              ))}
            </div>
          </header>

          <section className="mt-8 rounded-lg border border-green-100/70 bg-white/90 p-8 shadow-soft">
            <MarkdownRenderer content={article.content} />
          </section>

          <nav className="mt-8 grid gap-4 sm:grid-cols-2">
            {article.previousArticle ? (
              <Link
                to={`/articles/${article.previousArticle.id}`}
                className="rounded-lg border border-green-100/70 bg-white/80 p-5 hover:-translate-y-0.5 hover:border-coral-400"
              >
                <span className="text-sm text-green-600/70">上一篇</span>
                <strong className="mt-2 block text-green-800">{article.previousArticle.title}</strong>
              </Link>
            ) : (
              <div className="rounded-lg border border-green-100/70 bg-white/50 p-5 text-green-600/60">
                已经是最早一篇
              </div>
            )}

            {article.nextArticle ? (
              <Link
                to={`/articles/${article.nextArticle.id}`}
                className="rounded-lg border border-green-100/70 bg-white/80 p-5 text-right hover:-translate-y-0.5 hover:border-coral-400"
              >
                <span className="text-sm text-green-600/70">下一篇</span>
                <strong className="mt-2 block text-green-800">{article.nextArticle.title}</strong>
              </Link>
            ) : (
              <div className="rounded-lg border border-green-100/70 bg-white/50 p-5 text-right text-green-600/60">
                已经是最新一篇
              </div>
            )}
          </nav>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
            <p className="text-sm font-medium text-coral-400">Contents</p>
            <h2 className="mt-2 text-lg font-semibold text-green-800">目录</h2>
            <nav className="mt-5 space-y-3 text-sm">
              {article.headings.length > 0 ? (
                article.headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-green-600/80 hover:text-coral-400 ${
                      heading.level === 3 ? 'pl-4' : ''
                    }`}
                  >
                    {heading.text}
                  </a>
                ))
              ) : (
                <span className="text-green-600/70">暂无目录</span>
              )}
            </nav>
          </section>
        </aside>
      </div>
    </div>
  );
}
