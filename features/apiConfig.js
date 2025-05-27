import axios from 'axios';
 
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getCookie('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default api;