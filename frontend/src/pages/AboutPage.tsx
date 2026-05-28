import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { getPublicTags } from '../api/publicArticle';
import { getPublicSiteProfile } from '../api/site';
import type { ISiteProfile, ITag } from '../types';

const defaultProfile: ISiteProfile = {
  name: '留白',
  title: 'Java 后端开发 / AI Agent 实践者',
  bio: '记录后端工程、系统设计与 AI 协作编码。偏爱清晰边界、稳定交付和能留下思考空间的代码。',
  avatarUrl: '',
  githubUrl: 'https://github.com/',
  email: 'hello@liubaicode.dev',
  rssUrl: '/rss.xml',
};

const skillGroups = [
  {
    title: 'Java 后端',
    items: ['Spring Boot', 'MyBatis-Plus', 'MySQL', 'Redis', 'REST API'],
    description: '关注分层边界、事务一致性、接口可维护性和长期可演进的业务代码。',
  },
  {
    title: '工程化',
    items: ['Maven', 'Git', 'TypeScript', 'Vite', 'Tailwind CSS'],
    description: '习惯用清晰的目录结构、可复现命令和小步提交降低协作成本。',
  },
  {
    title: 'AI Agent 实践',
    items: ['需求拆解', '代码生成', '测试验证', '上下文管理', '工作流沉淀'],
    description: '把 Agent 当作协作伙伴，让它承担探索、重复劳动和验证环节。',
  },
];

const highlights = [
  {
    title: '全栈博客项目',
    text: '以个人博客为载体，逐步搭建前后端分离、文章浏览、归档展示和后续后台能力。',
  },
  {
    title: '内容驱动的前台体验',
    text: '首页、文章列表、详情与归档页都围绕阅读路径设计，避免把展示页做成空泛的装饰。',
  },
  {
    title: '面向维护的实现方式',
    text: '先使用类型化 mock 数据固定页面结构，后续替换真实接口时减少重写成本。',
  },
];

const focusAreas = ['Java 后端工程', 'AI Agent 协作编码', '个人知识库与技术写作', '可维护的前端体验'];

const contactIcons: Record<string, JSX.Element> = {
  GitHub: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.51 2.86 8.34 6.84 9.69.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.65c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.81c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M4.75 5h14.5A2.75 2.75 0 0 1 22 7.75v8.5A2.75 2.75 0 0 1 19.25 19H4.75A2.75 2.75 0 0 1 2 16.25v-8.5A2.75 2.75 0 0 1 4.75 5Zm0 1.5c-.2 0-.39.04-.56.11L12 12.18l7.81-5.57a1.4 1.4 0 0 0-.56-.11H4.75Zm15.75 2.04-8.06 5.74a.75.75 0 0 1-.88 0L3.5 8.54v7.71c0 .69.56 1.25 1.25 1.25h14.5c.69 0 1.25-.56 1.25-1.25V8.54Z"
      />
    </svg>
  ),
  RSS: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M5.5 17a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-1.25-5.75A8.5 8.5 0 0 1 12.75 19a.75.75 0 0 1-1.5 0 7 7 0 0 0-7-7 .75.75 0 0 1 0-1.5Zm0-5.25A13.75 13.75 0 0 1 18 19.75a.75.75 0 0 1-1.5 0A12.25 12.25 0 0 0 4.25 7.5a.75.75 0 0 1 0-1.5Z"
      />
    </svg>
  ),
};

export function AboutPage() {
  const [profile, setProfile] = useState<ISiteProfile>(defaultProfile);
  const [tags, setTags] = useState<ITag[]>([]);

  const profileLinks = useMemo(
    () =>
      [
        profile.githubUrl ? { label: 'GitHub', href: profile.githubUrl } : null,
        profile.email
          ? { label: 'Email', href: profile.email.startsWith('mailto:') ? profile.email : `mailto:${profile.email}` }
          : null,
        profile.rssUrl ? { label: 'RSS', href: profile.rssUrl } : null,
      ].filter(Boolean) as Array<{ label: string; href: string }>,
    [profile.email, profile.githubUrl, profile.rssUrl],
  );
  const avatarInitial = profile.name.trim().slice(0, 1) || '留';

  useEffect(() => {
    let ignore = false;

    async function loadAboutData() {
      try {
        const [profileData, tagData] = await Promise.all([getPublicSiteProfile(), getPublicTags()]);
        if (!ignore) {
          setProfile(profileData);
          setTags(tagData);
        }
      } catch {
        if (!ignore) {
          setTags([]);
        }
      }
    }

    void loadAboutData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-green-100/70 bg-green-50/70 p-8 shadow-soft">
        <p className="text-sm font-medium text-coral-400">About</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <h1 className="text-3xl font-semibold text-green-800">关于我</h1>
            <p className="mt-5 max-w-3xl text-lg leading-9 text-green-700">
              你好，我是 {profile.name}，一名关注 Java 后端、工程化交付和 AI Agent 实践的开发者。
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-green-600/85">{profile.bio}</p>
          </div>

          <div className="rounded-lg border border-white/80 bg-white/70 p-5">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || '头像'}
                  className="h-20 w-20 rounded-full border border-coral-100 object-cover shadow-soft"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral-50 text-2xl font-semibold text-coral-600 shadow-soft">
                  {avatarInitial}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-green-800">{profile.name}</h2>
                <p className="mt-1 text-sm text-green-600/75">{profile.title}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {profileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-100 bg-white text-green-600 transition duration-200 hover:-translate-y-0.5 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
                >
                  {contactIcons[link.label]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <main className="min-w-0 space-y-8">
          <section className="rounded-lg border border-green-100/70 bg-white/80 p-8 shadow-soft">
            <p className="text-sm font-medium text-coral-400">Stack</p>
            <h2 className="mt-2 text-2xl font-semibold text-green-800">技术栈与工作方式</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {skillGroups.map((group) => (
                <article
                  key={group.title}
                  className="rounded-lg border border-green-100/70 bg-green-50/45 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-coral-100 hover:bg-coral-50/45"
                >
                  <h3 className="text-lg font-semibold text-green-800">{group.title}</h3>
                  <p className="mt-3 min-h-[84px] text-sm leading-7 text-green-600/80">{group.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-green-100 bg-white/80 px-3 py-1 text-xs font-medium text-green-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-green-100/70 bg-white/80 p-8 shadow-soft">
            <p className="text-sm font-medium text-coral-400">Portfolio</p>
            <h2 className="mt-2 text-2xl font-semibold text-green-800">项目亮点</h2>
            <div className="mt-6 space-y-4">
              {highlights.map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-4 rounded-lg border border-green-100/70 bg-white/75 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-coral-100 md:grid-cols-[72px_minmax(0,1fr)]"
                >
                  <span className="text-sm font-semibold text-coral-400">0{index + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-green-600/80">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-green-100/70 bg-white/80 p-8 shadow-soft">
            <p className="text-sm font-medium text-coral-400">Direction</p>
            <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_240px] md:items-start">
              <div>
                <h2 className="text-2xl font-semibold text-green-800">当前关注</h2>
                <p className="mt-4 text-base leading-8 text-green-600/85">
                  我更喜欢把技术能力放进真实工作流里验证：从接口边界、数据访问、缓存策略，到前端阅读体验和 Agent
                  协作，每一块都服务于更稳定的交付。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-coral-100 bg-coral-50 px-3 py-1.5 text-sm font-medium text-coral-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
            <p className="text-sm font-medium text-coral-400">Intent</p>
            <h2 className="mt-2 text-lg font-semibold text-green-800">求职与合作方向</h2>
            <p className="mt-4 text-sm leading-7 text-green-600/80">
              偏向 Java 后端、全栈工程化、AI 工具链和内容型产品方向。希望参与重视代码质量、稳定交付和长期维护的项目。
            </p>
            <Link
              to="/articles"
              className="mt-5 inline-flex rounded-full bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97]"
            >
              查看文章
            </Link>
          </section>

          <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
            <p className="text-sm font-medium text-coral-400">Topics</p>
            <h2 className="mt-2 text-lg font-semibold text-green-800">写作主题</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                >
                  {tag.name} ({tag.count})
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
