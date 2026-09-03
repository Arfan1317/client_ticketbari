import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
    
      console.error('Authentication error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;
