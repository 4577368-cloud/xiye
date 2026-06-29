import { useState, useEffect, useCallback } from 'react';

const ADMIN_USER = {
  username: 'admin',
  password: 'admin',
};

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    username: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAuth(parsed);
      } catch {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const newAuth = { isLoggedIn: true, username };
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));
      return { success: true };
    }
    return { success: false, error: '用户名或密码错误' };
  }, []);

  const logout = useCallback(() => {
    setAuth({ isLoggedIn: false, username: null });
    localStorage.removeItem('auth');
  }, []);

  return {
    ...auth,
    login,
    logout,
  };
}
