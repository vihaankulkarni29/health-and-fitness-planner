import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../auth/token';

describe('Token Helper', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should store and retrieve access token', () => {
    const token = 'test_access_token_123';
    setAccessToken(token);
    expect(getAccessToken()).toBe(token);
  });

  it('should store and retrieve refresh token', () => {
    const token = 'test_refresh_token_456';
    setRefreshToken(token);
    expect(getRefreshToken()).toBe(token);
  });

  it('should clear all tokens', () => {
    setAccessToken('access_123');
    setRefreshToken('refresh_456');
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it('should return null for missing access token', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('should return null for missing refresh token', () => {
    expect(getRefreshToken()).toBeNull();
  });

  it('should handle legacy token key fallback', () => {
    // Simulate old token storage
    localStorage.setItem('token', 'legacy_token');
    expect(getAccessToken()).toBe('legacy_token');
  });

  it('should prefer access_token over legacy token key', () => {
    localStorage.setItem('token', 'legacy_token');
    localStorage.setItem('access_token', 'new_token');
    expect(getAccessToken()).toBe('new_token');
  });
});
