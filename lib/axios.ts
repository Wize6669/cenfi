import axios from 'axios';
import { config } from '@/config';

const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;

const instanceAxios = axios.create({
     baseURL: `${HOST_BACK_END}/api/v1`
});

const axiosInterceptorJWT = instanceAxios.interceptors.request.use(config => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      window.alert('Error axios interceptor');
    }

    config.headers.Authorization = `Bearer ${authToken}`;
    
    return config;
  })

export { axiosInterceptorJWT }