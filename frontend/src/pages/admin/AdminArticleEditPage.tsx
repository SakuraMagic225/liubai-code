import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { createAdminArticle, getAdminArticleDetail, updateAdminArticle } from '../../api/adminArticle';
import { MarkdownRenderer } from '../../components/article/MarkdownRenderer';
import type { IAdminArticlePayload } from '../../types';

interface ArticleFormState {
  title: string;
  summary: string;
  contentMd: string;
  contentHtml: string;
  coverImage: string;
  status: string;
  tagIdsText: string;
}

const emptyForm: ArticleFormState = {
  title: '',
  summary: '',
  contentMd: '## 新文章\n\n从这里开始写作。',
  contentHtml: '',
  coverImage: '',
  status: '0',
  tagIdsText: '',
};

function parseTagIds(value: string) {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function buildPayload(form: ArticleFormState): IAdminArticlePayload {
  return {
    title: form.title.trim(),
    summary: form.summary.trim(),
    contentMd: form.contentMd,
    contentHtml: form.contentHtml,
    coverImage: form.coverImage.trim(),
    status: Number(form.status),
    tagIds: parseTagIds(form.tagIdsText),
  };
}

export function AdminArticleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleId = id ? Number(id) : undefined;
  const isEdit = Number.isFinite(articleId);
  const [form, setForm] = useState<ArticleFormState>(emptyForm);
  const [loading, setLoading] = useState(Boolean(isEdit));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const previewContent = useMemo(
    () => (form.contentMd.trim() ? form.contentMd : '## 预览\n\nMarkdown 内容会显示在这里。'),
    [form.contentMd],
  );

  useEffect(() => {
    if (!isEdit || !articleId) {
      return;
    }

    const currentArticleId = articleId;
    let ignore = false;

    async function loadArticle() {
      setLoading(true);
      setError('');

      try {
        const detail = await getAdminArticleDetail(currentArticleId);
        if (!ignore) {
          setForm({
            title: detail.title ?? '',
            summary: detail.summary ?? '',
            contentMd: detail.contentMd ?? '',
            contentHtml: detail.contentHtml ?? '',
            coverImage: detail.coverImage ?? '',
            status: String(detail.status),
            tagIdsText: detail.tagIds?.join(',') ?? '',
          });
        }
      } catch (currentError) {
        if (!ignore) {
          setError(currentError instanceof Error ? currentError.message : '文章详情加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      ignore = true;
    };
  }, [articleId, isEdit]);

  function updateField(field: keyof ArticleFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = buildPayload(form);
    if (!payload.title) {
      setError('请填写标题');
      setSaving(false);
      return;
    }

    if (!payload.contentMd.trim()) {
      setError('请填写 Markdown 正文');
      setSaving(false);
      return;
    }

    try {
      if (isEdit && articleId) {
        await updateAdminArticle(articleId, payload);
        setMessage('文章已保存');
      } else {
        const newId = await createAdminArticle(payload);
        navigate(`/admin/articles/${newId}/edit`, { replace: true });
      }
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-green-100 bg-white p-8 text-green-600/75">
        文章加载中...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-coral-400">{isEdit ? 'Edit' : 'New'}</p>
          <h2 className="mt-1 text-2xl font-semibold text-green-800">
            {isEdit ? '编辑文章' : '新建文章'}
          </h2>
          <p className="mt-2 text-sm text-green-600/75">编辑 Markdown 内容并实时预览渲染效果。</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/articles"
            className="rounded-md border border-green-100 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
          >
            返回列表
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? '保存中...' : '保存文章'}
          </button>
        </div>
      </section>

      {message ? (
        <div className="rounded-md border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-coral-100 bg-coral-50 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-5 rounded-lg border border-green-100 bg-white p-5">
          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="article-title">
              标题
            </label>
            <input
              id="article-title"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              placeholder="文章标题"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="article-summary">
              摘要
            </label>
            <textarea
              id="article-summary"
              value={form.summary}
              onChange={(event) => updateField('summary', event.target.value)}
              rows={3}
              className="mt-2 w-full resize-y rounded-md border border-green-100 px-3 py-2 text-sm leading-6 text-green-800 outline-none focus:border-coral-400"
              placeholder="文章摘要"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="article-status">
                状态
              </label>
              <select
                id="article-status"
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              >
                <option value="0">草稿</option>
                <option value="1">已发布</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="article-tags">
                标签 ID
              </label>
              <input
                id="article-tags"
                value={form.tagIdsText}
                onChange={(event) => updateField('tagIdsText', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="例如：1,2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="article-cover">
              封面图 URL
            </label>
            <input
              id="article-cover"
              value={form.coverImage}
              onChange={(event) => updateField('coverImage', event.target.value)}
              className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="article-md">
              Markdown 正文
            </label>
            <textarea
              id="article-md"
              value={form.contentMd}
              onChange={(event) => updateField('contentMd', event.target.value)}
              rows={18}
              className="mt-2 w-full resize-y rounded-md border border-green-100 px-3 py-2 font-mono text-sm leading-6 text-green-800 outline-none focus:border-coral-400"
              placeholder="Markdown 正文"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="article-html">
              HTML 正文
            </label>
            <textarea
              id="article-html"
              value={form.contentHtml}
              onChange={(event) => updateField('contentHtml', event.target.value)}
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-green-100 px-3 py-2 font-mono text-sm leading-6 text-green-800 outline-none focus:border-coral-400"
              placeholder="可留空，后续再接自动渲染"
            />
          </div>
        </div>

        <div className="rounded-lg border border-green-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between border-b border-green-100 pb-3">
            <div>
              <p className="text-sm font-medium text-coral-400">Preview</p>
              <h3 className="mt-1 text-lg font-semibold text-green-800">Markdown 预览</h3>
            </div>
          </div>
          <div className="max-h-[980px] overflow-y-auto rounded-md bg-white px-2">
            <MarkdownRenderer content={previewContent} />
          </div>
        </div>
      </section>
    </form>
  );
}
