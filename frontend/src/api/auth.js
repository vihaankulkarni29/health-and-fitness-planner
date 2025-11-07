import client from './client';

export async function login(email, password) {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const { data } = await client.post('/auth/login/access-token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return data; // { access_token, token_type }
}

export async function me() {
  const { data } = await client.get('/auth/me');
  return data; // user object
}

export function logout() {
  // Clear the access token from localStorage
  localStorage.removeItem('access_token');
}
