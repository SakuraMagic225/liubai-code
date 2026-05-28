import axios from 'axios';

import type { IApiResult } from '../types';
import { clearAdminSession, getAdminToken } from './adminSession';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const result = response.data as IApiResult<unknown>;

    if (typeof result?.code === 'number' && result.code !== 200) {
      return Promise.reject(new Error(result.message || '请求失败'));
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAdminSession();
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        const redirect = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
        window.location.assign(`/admin/login?redirect=${redirect}`);
      }
    }
    const message = error.response?.data?.message || error.message || '网络请求失败';
    return Promise.reject(new Error(message));
  },
);

export async function getApiData<T>(url: string, params?: unknown): Promise<T> {
  const response = await request.get<IApiResult<T>>(url, { params });
  return response.data.data;
}

export async function postApiData<T, B = unknown>(url: string, body: B): Promise<T> {
  const response = await request.post<IApiResult<T>>(url, body);
  return response.data.data;
}

export async function putApiData<B = unknown>(url: string, body: B): Promise<void> {
  await request.put<IApiResult<void>>(url, body);
}

export async function uploadApiData<T>(url: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await request.post<IApiResult<T>>(url, formData);
  return response.data.data;
}

export async function patchApiData<B = unknown>(url: string, body: B): Promise<void> {
  await request.patch<IApiResult<void>>(url, body);
}

export async function deleteApiData(url: string): Promise<void> {
  await request.delete<IApiResult<void>>(url);
}
