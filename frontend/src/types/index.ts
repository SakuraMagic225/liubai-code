export interface IArticleSummary {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  readMinutes: number;
  coverImage?: string;
  viewCount?: number;
}

export interface IArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface IArticleDetail extends IArticleSummary {
  content: string;
  updatedAt: string;
  headings: IArticleHeading[];
  previousArticle?: IArticleSummary;
  nextArticle?: IArticleSummary;
}

export interface IArticleQuery {
  page?: number;
  pageSize?: number;
  tag?: string;
  keyword?: string;
}

export interface IArticlePage {
  records: IArticleSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IArchiveMonthGroup {
  month: number;
  articles: IArticleSummary[];
}

export interface IArchiveYearGroup {
  year: number;
  months: IArchiveMonthGroup[];
}

export interface IArchiveStats {
  articleCount: number;
  yearCount: number;
  tagCount: number;
}

export interface ITag {
  id: number;
  name: string;
  color: string;
  count: number;
}

export interface IProfileLink {
  label: string;
  href: string;
}

export interface IProfile {
  name: string;
  title: string;
  bio: string;
  links: IProfileLink[];
}

export interface IHomeStats {
  articleCount: number;
  tagCount: number;
  viewCount: number;
}

export interface IHomeData {
  featuredArticle?: IArticleSummary | null;
  latestArticles: IArticleSummary[];
  tags: ITag[];
  stats: IHomeStats;
}

export interface IArchiveData {
  groups: IArchiveYearGroup[];
  stats: IArchiveStats;
}

export interface IApiResult<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface IPageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IAdminArticleQuery {
  page?: number;
  pageSize?: number;
  status?: number;
  keyword?: string;
}

export interface IAdminArticleListItem {
  id: number;
  title: string;
  summary?: string;
  coverImage?: string;
  status: number;
  viewCount: number;
  tagNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAdminArticleDetail extends IAdminArticleListItem {
  contentMd: string;
  contentHtml?: string;
  tagIds: number[];
}

export interface IAdminArticlePayload {
  title: string;
  summary?: string;
  contentMd: string;
  contentHtml?: string;
  coverImage?: string;
  status: number;
  tagIds: number[];
}
