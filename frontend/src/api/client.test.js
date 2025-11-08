import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import client from '../api/client';
import { setAccessToken, setRefreshToken, clearTokens, getAccessToken } from '../auth/token';
import { refreshTokens } from '../api/auth';

describe('Axios Client Auth Integration', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(client);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
  });

  it('should inject Authorization header when token exists', async () => {
    setAccessToken('test_token_123');
    mock.onGet('/test').reply((config) => {
      expect(config.headers.Authorization).toBe('Bearer test_token_123');
      return [200, { success: true }];
    });

    await client.get('/test');
  });

  it('should not add Authorization header when no token', async () => {
    mock.onGet('/test').reply((config) => {
      expect(config.headers.Authorization).toBeUndefined();
      return [200, { success: true }];
    });

    await client.get('/test');
  });

  it('should attempt refresh on 401 and retry request', async () => {
    setAccessToken('expired_token');
    setRefreshToken('valid_refresh_token');

    // First request fails with 401
    mock.onGet('/protected').replyOnce(401);

    // Refresh endpoint returns new tokens
    mock.onPost('/auth/refresh').replyOnce(200, {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      token_type: 'bearer'
    });

    // Retry the original request with new token
    mock.onGet('/protected').replyOnce(200, { data: 'success' });

    const response = await client.get('/protected');
    expect(response.data.data).toBe('success');
    expect(getAccessToken()).toBe('new_access_token');
  });

  it('should clear tokens when refresh fails', async () => {
    setAccessToken('expired_token');
    setRefreshToken('invalid_refresh');

    mock.onGet('/protected').replyOnce(401);
    mock.onPost('/auth/refresh').replyOnce(401, { detail: 'Invalid refresh token' });

    try {
      await client.get('/protected');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }

    expect(getAccessToken()).toBeNull();
  });

  it('should not retry 401 multiple times (prevent infinite loop)', async () => {
    setAccessToken('expired_token');
    setRefreshToken('valid_refresh');

    let requestCount = 0;
    mock.onGet('/protected').reply(() => {
      requestCount++;
      return [401];
    });

    mock.onPost('/auth/refresh').replyOnce(200, {
      access_token: 'new_token',
      refresh_token: 'new_refresh',
      token_type: 'bearer'
    });

    try {
      await client.get('/protected');
    } catch (error) {
      // Should only retry once, then fail
      expect(requestCount).toBe(2); // Original + 1 retry
    }
  });
});
