import type { IAdminLoginResult, IAdminProfile } from '../types';

const ADMIN_TOKEN_KEY = 'liubai_admin_token';
const ADMIN_PROFILE_KEY = 'liubai_admin_profile';

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getStoredAdminProfile(): IAdminProfile | null {
  const rawProfile = window.localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile) as IAdminProfile;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function saveAdminSession(loginResult: IAdminLoginResult) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, loginResult.token);
  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(loginResult.admin));
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}
