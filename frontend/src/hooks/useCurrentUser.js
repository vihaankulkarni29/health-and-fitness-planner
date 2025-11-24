import { useEffect, useState, useCallback } from 'react';
import { me } from '../api/auth';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const u = await me();
      setUser(u);
    } catch (e) {
      setError('Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
