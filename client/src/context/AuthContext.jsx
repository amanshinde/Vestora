import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe, addDemoFunds } from '../api/auth.api.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vestora_token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
          localStorage.setItem('vestora_user', JSON.stringify(res.data.data));
        } catch {
          localStorage.removeItem('vestora_token');
          localStorage.removeItem('vestora_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('vestora_token', token);
    localStorage.setItem('vestora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('vestora_token', token);
    localStorage.setItem('vestora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vestora_token');
    localStorage.removeItem('vestora_user');
    setUser(null);
  }, []);

  const addDemoCapital = useCallback(async () => {
    const res = await addDemoFunds();
    const updatedUser = res.data.data;
    localStorage.setItem('vestora_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res.data.data);
      localStorage.setItem('vestora_user', JSON.stringify(res.data.data));
    } catch (e) {
      console.error('Failed to refresh member state', e);
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addDemoCapital,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
