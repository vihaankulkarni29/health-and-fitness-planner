import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens } from '../auth/token';
import { refreshTokens } from './auth';

// Use environment variable for API URL, fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rt = getRefreshToken();
        // We don't need to send rt in body if using cookies, but for now we send empty object or rely on cookie
        // The backend checks cookie if body is empty/null
        const { access_token } = await refreshTokens({});
        if (!access_token) throw new Error('Failed to refresh');
        // Retry original request with new Authorization header
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (e) {
        // Cleanup on refresh failure
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export default client;
