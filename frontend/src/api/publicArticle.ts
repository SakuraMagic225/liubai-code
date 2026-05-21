import type {
  IArchiveData,
  IArticleDetail,
  IArticlePage,
  IArticleQuery,
  IHomeData,
  ITag,
} from '../types';
import { getApiData } from './request';

const ARTICLES_URL = '/articles';

export function getPublicHomeData() {
  return getApiData<IHomeData>(`${ARTICLES_URL}/home`);
}

export function getPublicArticlePage(query: IArticleQuery) {
  return getApiData<IArticlePage>(ARTICLES_URL, query);
}

export function getPublicArticleDetail(id: number) {
  return getApiData<IArticleDetail>(`${ARTICLES_URL}/${id}`);
}

export function getPublicArchiveData() {
  return getApiData<IArchiveData>(`${ARTICLES_URL}/archive`);
}

export function getPublicTags() {
  return getApiData<ITag[]>('/tags');
}
