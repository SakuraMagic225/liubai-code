import { FormEvent, useEffect, useMemo, useState } from 'react';

import { createAdminTag, deleteAdminTag, getAdminTags, updateAdminTag } from '../../api/adminTag';
import type { IAdminTag, IAdminTagPayload } from '../../types';
import { formatDate } from '../../utils/format';

interface TagFormState {
  name: string;
  color: string;
}

const emptyForm: TagFormState = {
  name: '',
  color: '#EAF3DE',
};

const NOTICE_TIMEOUT = 3000;
const NOTICE_ANIMATION_DURATION = 250;

function buildPayload(form: TagFormState): IAdminTagPayload {
  return {
    name: form.name.trim(),
    color: form.color.trim(),
  };
}

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function AdminTagListPage() {
  const [tags, setTags] = useState<IAdminTag[]>([]);
  const [keyword, setKeyword] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [form, setForm] = useState<TagFormState>(emptyForm);
  const [editingTag, setEditingTag] = useState<IAdminTag | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState({
    type: 'success',
    text: '',
    visible: false,
  });

  const colorInputValue = useMemo(() => (isHexColor(form.color) ? form.color : '#EAF3DE'), [form.color]);
  const noticeText = error || message;
  const noticeType = error ? 'error' : 'success';

  async function loadTags(nextKeyword = keyword) {
    setLoading(true);
    setError('');

    try {
      const data = await getAdminTags(nextKeyword);
      setTags(data);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '标签列表加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTags('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (noticeText) {
      setNotice({
        type: noticeType,
        text: noticeText,
        visible: true,
      });

      const hideTimer = window.setTimeout(() => {
        setMessage('');
        setError('');
      }, NOTICE_TIMEOUT);

      return () => window.clearTimeout(hideTimer);
    }

    setNotice((current) => ({ ...current, visible: false }));
    const clearTimer = window.setTimeout(() => {
      setNotice((current) => (current.visible ? current : { ...current, text: '' }));
    }, NOTICE_ANIMATION_DURATION);

    return () => window.clearTimeout(clearTimer);
  }, [noticeText, noticeType]);

  function resetForm() {
    setEditingTag(null);
    setForm(emptyForm);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextKeyword = keywordInput.trim();
    setKeyword(nextKeyword);
    loadTags(nextKeyword);
  }

  function handleEdit(tag: IAdminTag) {
    setEditingTag(tag);
    setMessage('');
    setError('');
    setForm({
      name: tag.name,
      color: tag.color || '#EAF3DE',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = buildPayload(form);
    if (!payload.name) {
      setError('请填写标签名称');
      setSaving(false);
      return;
    }

    if (payload.color && !isHexColor(payload.color)) {
      setError('颜色请填写 #RRGGBB 格式');
      setSaving(false);
      return;
    }

    try {
      if (editingTag) {
        await updateAdminTag(editingTag.id, payload);
        setMessage('标签已更新');
      } else {
        await createAdminTag(payload);
        setMessage('标签已创建');
      }

      resetForm();
      await loadTags(keyword);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(tag: IAdminTag) {
    const confirmed = window.confirm(`确定删除标签「${tag.name}」吗？`);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await deleteAdminTag(tag.id);
      setMessage('标签已删除');
      await loadTags(keyword);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '删除失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-coral-400">Tags</p>
          <h2 className="mt-1 text-2xl font-semibold text-green-800">标签管理</h2>
          <p className="mt-2 text-sm text-green-600/75">维护文章可选标签，文章编辑页会直接使用这里的标签。</p>
        </div>
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_416px]">
        <div>
          <div className="mb-4 rounded-lg border border-green-100 bg-white p-4">
            <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="搜索标签名称"
                className="rounded-md border border-green-100 bg-white px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              />
              <button
                type="submit"
                className="rounded-md border border-green-100 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
              >
                搜索
              </button>
            </form>
          </div>

          <div
            className={`overflow-hidden transition-[max-height,opacity,margin,transform] duration-300 ease-out ${
              notice.visible ? 'mb-4 max-h-20 translate-y-0 opacity-100' : 'mb-0 max-h-0 -translate-y-1 opacity-0'
            }`}
          >
            <div
              className={`rounded-md border px-4 py-3 text-sm ${
                notice.type === 'error'
                  ? 'border-coral-100 bg-coral-50 text-coral-600'
                  : 'border-green-100 bg-green-50 text-green-700'
              }`}
            >
              {notice.text}
            </div>
          </div>

          <section className="overflow-hidden rounded-lg border border-green-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-fixed divide-y divide-green-100 text-sm">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[18%]" />
                  <col className="w-[14%]" />
                  <col className="w-[19%]" />
                  <col className="w-[25%]" />
                </colgroup>
                <thead className="bg-green-50/70 text-green-700">
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold">标签名</th>
                    <th className="px-4 py-3 text-center font-semibold">颜色</th>
                    <th className="px-4 py-3 text-center font-semibold">使用文章</th>
                    <th className="px-4 py-3 text-center font-semibold">更新时间</th>
                    <th className="px-4 py-3 text-center font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-green-50/35">
                      <td className="px-4 py-4 text-center font-semibold text-green-800">{tag.name}</td>
                      <td className="px-4 py-4 text-center text-green-600/75">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-4 w-4 rounded-full border border-green-100"
                            style={{ backgroundColor: tag.color || '#EAF3DE' }}
                          />
                          {tag.color || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-green-600/75">{tag.articleCount}</td>
                      <td className="px-4 py-4 text-center text-green-600/75">{formatDate(tag.updatedAt)}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(tag)}
                            className="h-8 rounded-md border border-green-100 px-3 text-xs font-medium text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tag)}
                            className="h-8 rounded-md border border-coral-100 px-3 text-xs font-medium text-coral-600 hover:bg-coral-50"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && tags.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-green-600/70">
                        暂无标签
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className="border-t border-green-100 px-4 py-4 text-sm text-green-600/70">
              {loading ? '加载中...' : `共 ${tags.length} 个标签`}
            </div>
          </section>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-green-100 bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-coral-400">{editingTag ? 'Edit' : 'New'}</p>
              <h3 className="mt-1 text-lg font-semibold text-green-800">
                {editingTag ? '编辑标签' : '新建标签'}
              </h3>
            </div>
            {editingTag ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-green-100 px-3 py-2 text-xs font-medium text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
              >
                取消编辑
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="tag-name">
                标签名
              </label>
              <input
                id="tag-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="例如：Java"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="tag-color">
                颜色
              </label>
              <div className="mt-2 grid grid-cols-[48px_minmax(0,1fr)] gap-2">
                <input
                  aria-label="选择标签颜色"
                  type="color"
                  value={colorInputValue}
                  onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                  className="h-10 w-12 cursor-pointer rounded-md border border-green-100 bg-white p-1"
                />
                <input
                  id="tag-color"
                  value={form.color}
                  onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                  className="rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                  placeholder="#EAF3DE"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? '保存中...' : editingTag ? '保存修改' : '创建标签'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
