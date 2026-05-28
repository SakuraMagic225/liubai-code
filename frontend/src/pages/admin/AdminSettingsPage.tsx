import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import { AvatarCropModal } from '../../components/admin/AvatarCropModal';
import { getAdminSiteProfile, updateAdminSiteProfile, uploadAdminAvatar } from '../../api/site';
import type { ISiteProfile } from '../../types';

const emptyProfile: ISiteProfile = {
  name: '',
  title: '',
  bio: '',
  avatarUrl: '',
  githubUrl: '',
  email: '',
  rssUrl: '',
};

const NOTICE_TIMEOUT = 3000;
const NOTICE_ANIMATION_DURATION = 250;

export function AdminSettingsPage() {
  const [profile, setProfile] = useState<ISiteProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState({ type: 'success', text: '', visible: false });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const noticeText = error || message;
  const noticeType = error ? 'error' : 'success';
  const avatarInitial = useMemo(() => profile.name.trim().slice(0, 1) || '留', [profile.name]);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setError('');

      try {
        const data = await getAdminSiteProfile();
        if (!ignore) {
          setProfile(data);
        }
      } catch (currentError) {
        if (!ignore) {
          setError(currentError instanceof Error ? currentError.message : '站点资料加载失败');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (noticeText) {
      setNotice({ type: noticeType, text: noticeText, visible: true });
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

  function updateField(field: keyof ISiteProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    setMessage('');
    setError('');
    setAvatarFile(file);
  }

  async function handleCroppedAvatarUpload(file: File) {
    setUploading(true);
    setMessage('');
    setError('');

    try {
      const result = await uploadAdminAvatar(file);
      setProfile((current) => ({ ...current, avatarUrl: result.avatarUrl }));
      setAvatarFile(null);
      setMessage('头像已上传');
    } catch (currentError) {
      setAvatarFile(null);
      setError(currentError instanceof Error ? currentError.message : '头像上传失败');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateAdminSiteProfile(profile);
      setMessage('站点设置已保存');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-green-100 bg-white p-8 text-green-600/75">
        站点设置加载中...
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-coral-400">Settings</p>
          <h2 className="mt-1 text-2xl font-semibold text-green-800">站点设置</h2>
          <p className="mt-2 text-sm text-green-600/75">维护首页和关于页共用的个人资料。</p>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? '保存中...' : '保存设置'}
        </button>
      </section>

      <div
        className={`overflow-hidden transition-[max-height,opacity,margin,transform] duration-300 ease-out ${
          notice.visible ? 'mb-0 max-h-20 translate-y-0 opacity-100' : 'mb-0 max-h-0 -translate-y-1 opacity-0'
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

      <section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-lg border border-green-100 bg-white p-5">
          <p className="text-sm font-medium text-coral-400">Avatar</p>
          <h3 className="mt-1 text-lg font-semibold text-green-800">头像</h3>
          <div className="mt-5 flex flex-col items-center rounded-lg border border-green-100 bg-green-50/50 p-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name || '头像'}
                className="h-40 w-40 rounded-full border border-green-100 object-cover shadow-soft"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-green-100 bg-white text-4xl font-semibold text-green-700 shadow-soft">
                {avatarInitial}
              </div>
            )}
            <label className="mt-5 inline-flex cursor-pointer rounded-md border border-green-100 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600">
              {uploading ? '上传中...' : '上传头像'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
            <p className="mt-3 text-center text-xs leading-5 text-green-600/65">
              支持 JPG、PNG、WebP，最大 5MB。建议使用清晰的正方形图片。
            </p>
          </div>
        </div>

        <div className="space-y-5 rounded-lg border border-green-100 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="profile-name">
                昵称
              </label>
              <input
                id="profile-name"
                value={profile.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="留白"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="profile-title">
                身份标题
              </label>
              <input
                id="profile-title"
                value={profile.title}
                onChange={(event) => updateField('title', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="Java 后端开发 / AI Agent 实践者"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="profile-bio">
              简介
            </label>
            <textarea
              id="profile-bio"
              value={profile.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              rows={5}
              className="mt-2 w-full resize-y rounded-md border border-green-100 px-3 py-2 text-sm leading-6 text-green-800 outline-none focus:border-coral-400"
              placeholder="写一段会出现在首页和关于页的个人简介"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-green-800" htmlFor="profile-avatar-url">
              头像 URL
            </label>
            <input
              id="profile-avatar-url"
              value={profile.avatarUrl}
              onChange={(event) => updateField('avatarUrl', event.target.value)}
              className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
              placeholder="/uploads/avatar/xxx.webp"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="profile-github">
                GitHub
              </label>
              <input
                id="profile-github"
                value={profile.githubUrl}
                onChange={(event) => updateField('githubUrl', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                value={profile.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="hello@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="profile-rss">
                RSS
              </label>
              <input
                id="profile-rss"
                value={profile.rssUrl}
                onChange={(event) => updateField('rssUrl', event.target.value)}
                className="mt-2 w-full rounded-md border border-green-100 px-3 py-2 text-sm text-green-800 outline-none focus:border-coral-400"
                placeholder="/rss.xml"
              />
            </div>
          </div>
        </div>
      </section>
      </form>

      {avatarFile ? (
        <AvatarCropModal
          file={avatarFile}
          confirming={uploading}
          onCancel={() => setAvatarFile(null)}
          onConfirm={(file) => {
            void handleCroppedAvatarUpload(file);
          }}
        />
      ) : null}
    </>
  );
}
