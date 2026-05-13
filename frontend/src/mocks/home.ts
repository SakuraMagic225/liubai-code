import type { IArticleSummary, IHomeStats, IProfile, ITag } from '../types';

export const featuredArticle: IArticleSummary = {
  id: 1,
  title: '从一次接口重构看 Spring Boot 分层边界',
  summary:
    '记录一次把 Controller、Service、Repository 职责重新理顺的过程，以及为什么清晰边界比技巧更耐用。',
  publishedAt: '2026-05-12',
  tags: ['Java', 'Spring Boot', '工程化'],
  featured: true,
  readMinutes: 8,
};

export const latestArticles: IArticleSummary[] = [
  featuredArticle,
  {
    id: 2,
    title: 'AI Agent 写代码时，我真正想让它接管什么',
    summary: '把 Agent 当成协作者，而不是自动补全：它适合承担探索、验证和重复劳动。',
    publishedAt: '2026-05-08',
    tags: ['AI Agent', '思考'],
    featured: false,
    readMinutes: 6,
  },
  {
    id: 3,
    title: 'MyBatis-Plus 的方便与边界',
    summary: '快速 CRUD 很香，但复杂查询、领域约束和事务边界仍然需要开发者自己守住。',
    publishedAt: '2026-04-29',
    tags: ['MyBatis-Plus', '数据库'],
    featured: false,
    readMinutes: 7,
  },
  {
    id: 4,
    title: '给个人博客设计一个不过度设计的后台',
    summary: '后台界面应该安静、直接、耐用，把写作路径做短，而不是把功能堆满。',
    publishedAt: '2026-04-21',
    tags: ['产品设计', '后台'],
    featured: false,
    readMinutes: 5,
  },
  {
    id: 5,
    title: 'Redis 缓存文章热榜的三个小坑',
    summary: '缓存键设计、过期策略和计数一致性，是小项目里也值得认真处理的问题。',
    publishedAt: '2026-04-12',
    tags: ['Redis', '性能'],
    featured: false,
    readMinutes: 6,
  },
];

export const tags: ITag[] = [
  { id: 1, name: 'Java', color: '#EAF3DE', count: 12 },
  { id: 2, name: 'Spring Boot', color: '#EAF3DE', count: 9 },
  { id: 3, name: 'AI Agent', color: '#FAECE7', count: 6 },
  { id: 4, name: 'MySQL', color: '#EAF3DE', count: 5 },
  { id: 5, name: '工程化', color: '#FAECE7', count: 8 },
  { id: 6, name: 'Redis', color: '#EAF3DE', count: 4 },
];

export const profile: IProfile = {
  name: '留白',
  title: 'Java 后端开发 / AI Agent 实践者',
  bio: '记录后端工程、系统设计与 AI 协作编码。偏爱清晰边界、稳定交付和能留下思考空间的代码。',
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Email', href: 'mailto:hello@liubaicode.dev' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};

export const homeStats: IHomeStats = {
  articleCount: 28,
  tagCount: 12,
  viewCount: 18640,
};
