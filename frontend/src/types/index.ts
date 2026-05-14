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
