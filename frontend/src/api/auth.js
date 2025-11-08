import client from './client';
import { setAccessToken, setRefreshToken, clearTokens } from '../auth/token';

export async function login(email, password) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const { data } = await client.post('/auth/login/access-token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  // data: { access_token, refresh_token, token_type }
  if (data?.access_token) {
    setAccessToken(data.access_token);
  }
  if (data?.refresh_token) {
    setRefreshToken(data.refresh_token);
  }
  return data;
}

export async function me() {
  const { data } = await client.get('/auth/me');
  return data; // user object
}

export function logout() {
  clearTokens();
}

export async function refreshTokens(refreshToken) {
  const { data } = await client.post('/auth/refresh', { refresh_token: refreshToken });
  if (data?.access_token) setAccessToken(data.access_token);
  if (data?.refresh_token) setRefreshToken(data.refresh_token);
  return data;
}
