import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ArticleList } from '../components/article/ArticleList';
import { Pagination } from '../components/common/Pagination';
import { TagBadge } from '../components/common/TagBadge';
import { articleSummaries, getAllTags, getArticlePage } from '../mocks/articles';

const PAGE_SIZE = 5;

export function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const tag = searchParams.get('tag') ?? undefined;
  const keyword = searchParams.get('keyword') ?? '';
  const [keywordInput, setKeywordInput] = useState(keyword);

  const articlePage = useMemo(
    () => getArticlePage({ page, pageSize: PAGE_SIZE, tag, keyword }),
    [keyword, page, tag],
  );
  const tags = getAllTags();

  function updateQuery(next: { page?: number; tag?: string; keyword?: string }) {
    const params = new URLSearchParams(searchParams);
    const nextPage = next.page ?? 1;

    params.set('page', String(nextPage));

    if ('tag' in next) {
      if (next.tag) {
        params.set('tag', next.tag);
      } else {
        params.delete('tag');
      }
    }

    if ('keyword' in next) {
      if (next.keyword?.trim()) {
        params.set('keyword', next.keyword.trim());
      } else {
        params.delete('keyword');
      }
    }

    setSearchParams(params);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery({ keyword: keywordInput, page: 1 });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="min-w-0 space-y-8">
          <section className="rounded-lg border border-green-100/70 bg-green-50/70 p-8 shadow-soft">
            <p className="text-sm font-medium text-coral-400">Articles</p>
            <h1 className="mt-3 text-3xl font-semibold text-green-800">文章列表</h1>
            <p className="mt-4 max-w-2xl text-green-600/85">
              按时间倒序整理所有文章，可以通过标签和关键词快速找到相关内容。
            </p>
          </section>

          <form onSubmit={handleSearch} className="flex gap-3 rounded-lg border border-green-100/70 bg-white/80 p-3">
            <input
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              placeholder="搜索标题、摘要或正文"
              className="min-w-0 flex-1 rounded-md border border-green-100 bg-white px-4 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
            />
            <button
              type="submit"
              className="rounded-md bg-coral-400 px-5 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97]"
            >
              搜索
            </button>
          </form>

          {(tag || keyword) && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-green-600/80">
              <span>当前筛选：</span>
              {tag ? <TagBadge name={tag} /> : null}
              {keyword ? <span className="rounded-full bg-coral-50 px-3 py-1 text-coral-600">{keyword}</span> : null}
              <button
                type="button"
                onClick={() => {
                  setKeywordInput('');
                  setSearchParams({});
                }}
                className="font-medium text-coral-400 hover:text-coral-600"
              >
                清除
              </button>
            </div>
          )}

          {articlePage.records.length > 0 ? (
            <>
              <ArticleList articles={articlePage.records} title="全部文章" kicker={`${articlePage.total} 篇文章`} />
              <Pagination
                page={articlePage.page}
                totalPages={articlePage.totalPages}
                onChange={(nextPage) => updateQuery({ page: nextPage })}
              />
            </>
          ) : (
            <div className="rounded-lg border border-green-100/70 bg-white/80 p-8 text-green-600/80">
              没有找到匹配的文章，可以换个关键词试试。
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
            <p className="text-sm font-medium text-coral-400">Tags</p>
            <h2 className="mt-2 text-lg font-semibold text-green-800">标签筛选</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => updateQuery({ tag: undefined, page: 1 })}>
                <TagBadge name="全部" count={articleSummaries.length} />
              </button>
              {tags.map((item) => (
                <button key={item.id} type="button" onClick={() => updateQuery({ tag: item.name, page: 1 })}>
                  <TagBadge name={item.name} count={item.count} />
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
