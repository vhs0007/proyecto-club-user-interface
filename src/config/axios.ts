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
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});




export default AxiosInstance;