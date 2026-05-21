import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { deleteAdminArticle, getAdminArticles, updateAdminArticleStatus } from '../../api/adminArticle';
import { Pagination } from '../../components/common/Pagination';
import type { IAdminArticleListItem, IPageResult } from '../../types';
import { formatDate } from '../../utils/format';

const PAGE_SIZE = 10;

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: '0' },
  { label: '已发布', value: '1' },
];

function getStatusLabel(status: number) {
  return status === 1 ? '已发布' : '草稿';
}

function getStatusClass(status: number) {
  return status === 1
    ? 'border-green-100 bg-green-50 text-green-600'
    : 'border-coral-100 bg-coral-50 text-coral-600';
}

export function AdminArticleListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const keyword = searchParams.get('keyword') ?? '';
  const status = searchParams.get('status') ?? '';
  const [keywordInput, setKeywordInput] = useState(keyword);
  const [articlePage, setArticlePage] = useState<IPageResult<IAdminArticleListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const statusNumber = status === '' ? undefined : Number(status);

  const queryKey = useMemo(
    () => ({ page: safePage, pageSize: PAGE_SIZE, status: statusNumber, keyword }),
    [keyword, safePage, statusNumber],
  );

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      setLoading(true);
      setError('');

      try {
        const data = await getAdminArticles(queryKey);
        if (!ignore) {
          setArticlePage(data);
        }
      } catch (currentError) {
        if (!ignore) {
          setError(currentError instanceof Error ? currentError.message : '文章列表加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      ignore = true;
    };
  }, [queryKey]);

  function updateQuery(next: { page?: number; keyword?: string; status?: string }) {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(next.page ?? 1));

    if ('keyword' in next) {
      if (next.keyword?.trim()) {
        params.set('keyword', next.keyword.trim());
      } else {
        params.delete('keyword');
      }
    }

    if ('status' in next) {
      if (next.status !== undefined && next.status !== '') {
        params.set('status', next.status);
      } else {
        params.delete('status');
      }
    }

    setSearchParams(params);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery({ keyword: keywordInput, page: 1 });
  }

  async function handleDelete(article: IAdminArticleListItem) {
    const confirmed = window.confirm(`确定删除《${article.title}》吗？`);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteAdminArticle(article.id);
      const data = await getAdminArticles(queryKey);
      setArticlePage(data);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '删除失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(article: IAdminArticleListItem, nextStatus: number) {
    if (article.status === nextStatus) {
      return;
    }

    setUpdatingStatusId(article.id);
    setError('');

    try {
      await updateAdminArticleStatus(article.id, nextStatus);
      const data = await getAdminArticles(queryKey);
      setArticlePage(data);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '状态更新失败');
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-coral-400">Articles</p>
          <h2 className="mt-1 text-2xl font-semibold text-green-800">文章管理</h2>
          <p className="mt-2 text-sm text-green-600/75">管理草稿、发布状态和文章内容。</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97]"
        >
          新建文章
        </Link>
      </section>

      <section className="rounded-lg border border-green-100 bg-white p-4">
        <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
          <input
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="搜索标题、摘要或正文"
            className="rounded-md border border-green-100 bg-white px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
          />
          <select
            value={status}
            onChange={(event) => updateQuery({ status: event.target.value, page: 1 })}
            className="rounded-md border border-green-100 bg-white px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
          >
            {statusOptions.map((item) => (
              <option key={item.label} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
          >
            搜索
          </button>
        </form>
      </section>

      {error ? (
        <div className="rounded-md border border-coral-100 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-green-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] table-fixed divide-y divide-green-100 text-left text-sm">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[10%]" />
              <col className="w-[13%]" />
              <col className="w-[7%]" />
              <col className="w-[13%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead className="bg-green-50/70 text-green-700">
              <tr>
                <th className="px-4 py-3 text-center font-semibold">标题</th>
                <th className="px-4 py-3 text-center font-semibold">状态</th>
                <th className="px-4 py-3 text-center font-semibold">标签</th>
                <th className="px-4 py-3 text-center font-semibold">阅读</th>
                <th className="px-4 py-3 text-center font-semibold">更新时间</th>
                <th className="px-4 py-3 text-center font-semibold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {articlePage?.records.map((article) => (
                <tr key={article.id} className="hover:bg-green-50/35">
                  <td className="max-w-md px-4 py-4">
                    <p className="font-semibold text-green-800">{article.title}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        article.status,
                      )}`}
                    >
                      {getStatusLabel(article.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-green-600/75">
                    {article.tagNames.length > 0 ? article.tagNames.join('、') : '无标签'}
                  </td>
                  <td className="px-4 py-4 text-center text-green-600/75">{article.viewCount}</td>
                  <td className="px-4 py-4 text-center text-green-600/75">{formatDate(article.updatedAt)}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-nowrap justify-center gap-2">
                      <select
                        value={article.status}
                        disabled={updatingStatusId === article.id}
                        onChange={(event) => handleStatusChange(article, Number(event.target.value))}
                        className="h-8 rounded-md border border-green-100 bg-white px-2 text-xs font-medium text-green-700 outline-none transition hover:border-coral-100 focus:border-coral-400 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`修改《${article.title}》发布状态`}
                      >
                        <option value={0}>设为草稿</option>
                        <option value={1}>发布</option>
                      </select>
                      <Link
                        to={`/admin/articles/${article.id}/edit`}
                        className="inline-flex h-8 items-center rounded-md border border-green-100 px-3 text-xs font-medium text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
                      >
                        编辑
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        className="h-8 rounded-md border border-coral-100 px-3 text-xs font-medium text-coral-600 hover:bg-coral-50"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && articlePage?.records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-green-600/70">
                    暂无文章
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-green-100 px-4 py-4">
          <span className="text-sm text-green-600/70">
            {loading ? '加载中...' : `共 ${articlePage?.total ?? 0} 篇文章`}
          </span>
          <Pagination
            page={articlePage?.page ?? safePage}
            totalPages={articlePage?.totalPages ?? 1}
            onChange={(nextPage) => updateQuery({ page: nextPage })}
          />
        </div>
      </section>
    </div>
  );
}
