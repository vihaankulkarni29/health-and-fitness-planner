import axios from 'axios';

// Use environment variable for API URL, fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally clear token and redirect to login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
