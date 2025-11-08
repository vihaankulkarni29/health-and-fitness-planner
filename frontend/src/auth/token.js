// Centralized token helpers for sustainable auth
// In production, prefer httpOnly cookies for refresh tokens.

const ACCESS_KEY = 'access_token';
const LEGACY_KEY = 'token';
const REFRESH_KEY = 'refresh_token'; // reserved for future

export function setAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_KEY, token);
    // Keep legacy key for backward compatibility during transition
    localStorage.setItem(LEGACY_KEY, token);
  } catch {}
}

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY) || localStorage.getItem(LEGACY_KEY);
  } catch {
    return null;
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(REFRESH_KEY);
  } catch {}
}

export function setRefreshToken(token) {
  try {
    localStorage.setItem(REFRESH_KEY, token);
  } catch {}
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}
