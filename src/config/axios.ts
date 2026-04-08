import axios, { AxiosError, AxiosHeaders } from 'axios';
import { useAuthStore, useClubIdStore } from '../store/store';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  const preview = token ? `${token.slice(0, 10)}...` : null;

  const isActivitiesRequest = config.url?.startsWith('/activities');

  if (!isActivitiesRequest) {
    console.log(
      '[Axios][Auth]',
      'Token presente:',
      !!token,
      'URL:',
      config.url,
      'method:',
      config.method,
      'preview:',
      preview
    );
  }

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const clubId = useClubIdStore.getState().clubId;
  if (clubId > 0) {
    config.headers.set('X-Club-Id', String(clubId));
  }

  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string | string[]; error?: string } | undefined;
    const message =
      data?.message ??
      data?.error ??
      error.message ??
      'Error inesperado';

    if (status && [400, 401, 404, 500, 501, 502].includes(status)) {
      alert(`Error ${status}: ${Array.isArray(message) ? message.join(', ') : message}`);
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;