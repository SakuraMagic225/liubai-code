import { getApiData, postApiData } from './request';
import type { IAdminLoginPayload, IAdminLoginResult, IAdminProfile } from '../types';

const ADMIN_AUTH_URL = '/admin/auth';

export function loginAdmin(payload: IAdminLoginPayload) {
  return postApiData<IAdminLoginResult, IAdminLoginPayload>(`${ADMIN_AUTH_URL}/login`, payload);
}

export function getCurrentAdmin() {
  return getApiData<IAdminProfile>(`${ADMIN_AUTH_URL}/me`);
}

export function logoutAdmin() {
  return postApiData<void, Record<string, never>>(`${ADMIN_AUTH_URL}/logout`, {});
}
