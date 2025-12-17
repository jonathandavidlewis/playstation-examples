import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SERVICE_URL = 'http://localhost:8081/api/auth';
const ACCOUNTS_SERVICE_URL = 'http://localhost:8080/api/accounts';

const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
});

const accountsApi = axios.create({
  baseURL: ACCOUNTS_SERVICE_URL,
});

// Add auth token to requests
authApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

accountsApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await authApi.post('/login', { email, password });
    return response.data;
  },

  register: async (email: string, username: string, password: string) => {
    const response = await authApi.post('/register', { email, username, password });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await authApi.post('/refresh', { refreshToken });
    return response.data;
  },

  validateToken: async (token: string) => {
    const response = await authApi.post('/validate', { token });
    return response.data;
  },
};

export const accountService = {
  getAccount: async (id: string) => {
    const response = await accountsApi.get(`/${id}`);
    return response.data;
  },

  updateAccount: async (id: string, data: any) => {
    const response = await accountsApi.put(`/${id}`, data);
    return response.data;
  },

  listAccounts: async (limit: number = 50) => {
    const response = await accountsApi.get(`?limit=${limit}`);
    return response.data;
  },
};
