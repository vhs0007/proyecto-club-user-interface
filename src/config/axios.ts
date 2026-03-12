import axios from 'axios';
import { useAuthStore } from '../store/store';

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
    config.headers = {};
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    const { config, status } = response;
    const isActivitiesRequest = config.url?.startsWith('/activities');

    // Para ACTIVITIES solo dejamos logs importantes (errores en el interceptor de error).
    if (!isActivitiesRequest) {
      console.log(
        '[Axios][Response]',
        config.method?.toUpperCase(),
        config.url,
        '→',
        status
      );
    }
    return response;
  },
  (error) => {
    if (error.config) {
      console.log(
        '[Axios][Response][Error]',
        error.config.method?.toUpperCase(),
        error.config.url,
        '→',
        error.response?.status
      );
    } else {
      console.log('[Axios][Response][Error]', error);
    }
    return Promise.reject(error);
  }
);




export default AxiosInstance;