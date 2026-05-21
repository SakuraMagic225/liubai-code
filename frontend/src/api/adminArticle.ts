import type {
  IAdminArticleDetail,
  IAdminArticleListItem,
  IAdminArticlePayload,
  IAdminArticleQuery,
  IPageResult,
} from '../types';
import { deleteApiData, getApiData, patchApiData, postApiData, putApiData } from './request';

const ADMIN_ARTICLES_URL = '/admin/articles';

export function getAdminArticles(query: IAdminArticleQuery) {
  return getApiData<IPageResult<IAdminArticleListItem>>(ADMIN_ARTICLES_URL, query);
}

export function getAdminArticleDetail(id: number) {
  return getApiData<IAdminArticleDetail>(`${ADMIN_ARTICLES_URL}/${id}`);
}

export function createAdminArticle(payload: IAdminArticlePayload) {
  return postApiData<number, IAdminArticlePayload>(ADMIN_ARTICLES_URL, payload);
}

export function updateAdminArticle(id: number, payload: IAdminArticlePayload) {
  return putApiData<IAdminArticlePayload>(`${ADMIN_ARTICLES_URL}/${id}`, payload);
}

export function updateAdminArticleStatus(id: number, status: number) {
  return patchApiData(`${ADMIN_ARTICLES_URL}/${id}/status`, { status });
}

export function deleteAdminArticle(id: number) {
  return deleteApiData(`${ADMIN_ARTICLES_URL}/${id}`);
}
