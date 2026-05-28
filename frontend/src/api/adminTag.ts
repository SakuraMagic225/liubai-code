import type { IAdminTag, IAdminTagPayload } from '../types';
import { deleteApiData, getApiData, postApiData, putApiData } from './request';

const ADMIN_TAGS_URL = '/admin/tags';

export function getAdminTags(keyword?: string) {
  return getApiData<IAdminTag[]>(ADMIN_TAGS_URL, keyword?.trim() ? { keyword: keyword.trim() } : undefined);
}

export function getAdminTagDetail(id: number) {
  return getApiData<IAdminTag>(`${ADMIN_TAGS_URL}/${id}`);
}

export function createAdminTag(payload: IAdminTagPayload) {
  return postApiData<number, IAdminTagPayload>(ADMIN_TAGS_URL, payload);
}

export function updateAdminTag(id: number, payload: IAdminTagPayload) {
  return putApiData<IAdminTagPayload>(`${ADMIN_TAGS_URL}/${id}`, payload);
}

export function deleteAdminTag(id: number) {
  return deleteApiData(`${ADMIN_TAGS_URL}/${id}`);
}
