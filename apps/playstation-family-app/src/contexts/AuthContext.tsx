import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

interface AuthContextData {
  isAuthenticated: boolean;
  userId: string | null;
  accountId: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedAccountId = await AsyncStorage.getItem('accountId');

      if (storedToken) {
        // Validate token
        const { valid } = await authService.validateToken(storedToken);
        if (valid) {
          setToken(storedToken);
          setUserId(storedUserId);
          setAccountId(storedAccountId);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      await storeAuth(response.token, response.refreshToken, response.userId, response.accountId);
      setToken(response.token);
      setUserId(response.userId);
      setAccountId(response.accountId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await authService.register(email, username, password);
      await storeAuth(response.token, response.refreshToken, response.userId, response.accountId);
      setToken(response.token);
      setUserId(response.userId);
      setAccountId(response.accountId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await clearAuth();
    setToken(null);
    setUserId(null);
    setAccountId(null);
    setIsAuthenticated(false);
  };

  const storeAuth = async (
    authToken: string,
    refreshToken: string,
    uid: string,
    accId: string
  ) => {
    await AsyncStorage.setItem('authToken', authToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('userId', uid);
    await AsyncStorage.setItem('accountId', accId);
  };

  const clearAuth = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('accountId');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        accountId,
        token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
