import axios from 'axios';

import type { IApiResult } from '../types';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 10000,
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

export async function patchApiData<B = unknown>(url: string, body: B): Promise<void> {
  await request.patch<IApiResult<void>>(url, body);
}

export async function deleteApiData(url: string): Promise<void> {
  await request.delete<IApiResult<void>>(url);
}
