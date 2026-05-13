export interface IArticleSummary {
  id: number;
  title: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  readMinutes: number;
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
