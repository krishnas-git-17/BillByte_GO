import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { API_CONFIG } from '../config/api.config';

/* ================= TYPES ================= */

export interface LoginResponse {
  token: string;
  role: string;
  email: string;
}

/* ================= CONSTANTS ================= */

const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';
const EMAIL_KEY = 'email';

/* ================= SERVICE ================= */

export const AuthService = {
  /* ===== LOGIN ===== */
async login(username: string, password: string): Promise<LoginResponse> {
  const isEmail = username.includes('@');

  const payload = isEmail
    ? { email: username, password }
    : { employeeId: username, password };

  const res = await api.post<LoginResponse>(
    API_CONFIG.AUTH.LOGIN,
    payload
  );

  const { token, role, email } = res.data;

  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(ROLE_KEY, role);
  await SecureStore.setItemAsync(EMAIL_KEY, email ?? '');

  return res.data;
},
  /* ===== LOGOUT ===== */
  async logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ROLE_KEY);
    await SecureStore.deleteItemAsync(EMAIL_KEY);
  },

  /* ===== TOKEN ===== */
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  /* ===== ROLE ===== */
  async getRole(): Promise<string | null> {
    return SecureStore.getItemAsync(ROLE_KEY);
  },

  /* ===== EMAIL ===== */
  async getEmail(): Promise<string | null> {
    return SecureStore.getItemAsync(EMAIL_KEY);
  },

  /* ===== LOGIN CHECK ===== */
  async isLoggedIn(): Promise<boolean> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return Boolean(token);
  },
};
