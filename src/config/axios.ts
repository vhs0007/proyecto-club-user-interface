import axios, { AxiosHeaders } from 'axios';
import { useAuthStore, useClubIdStore } from '../store/store';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
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

export default AxiosInstance;