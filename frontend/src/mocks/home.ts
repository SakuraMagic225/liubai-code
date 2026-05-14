import type { IProfile } from '../types';
import { articleSummaries, featuredArticle, getAllTags, homeStats } from './articles';

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

export const latestArticles = articleSummaries.slice(0, 5);
export const tags = getAllTags();
export { featuredArticle, homeStats };
