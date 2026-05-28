import type { IAvatarUploadResult, ISiteProfile } from '../types';
import { getApiData, putApiData, uploadApiData } from './request';

const SITE_PROFILE_URL = '/site/profile';
const ADMIN_SITE_PROFILE_URL = '/admin/site/profile';

export function getPublicSiteProfile() {
  return getApiData<ISiteProfile>(SITE_PROFILE_URL);
}

export function getAdminSiteProfile() {
  return getApiData<ISiteProfile>(ADMIN_SITE_PROFILE_URL);
}

export function updateAdminSiteProfile(profile: ISiteProfile) {
  return putApiData<ISiteProfile>(ADMIN_SITE_PROFILE_URL, profile);
}

export function uploadAdminAvatar(file: File) {
  return uploadApiData<IAvatarUploadResult>(`${ADMIN_SITE_PROFILE_URL}/avatar`, file);
}
