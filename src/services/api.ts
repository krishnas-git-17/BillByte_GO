import axios from 'axios';
import { API_CONFIG } from '@/src/config/api.config';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { realtimeService } from './realtime.service';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  async config => {
    const token = await SecureStore.getItemAsync('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('[API REQUEST]', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;

    console.log(
      '[API ERROR]',
      status,
      error?.response?.data || error.message
    );

    /**
     * 🔥 GLOBAL FAIL-SAFE LOGOUT CONDITIONS
     * - Token expired
     * - Invalid token
     * - Backend crash
     * - Network lost
     */
    if (
      status === 401 ||
      status === 403 ||
      status === 500 ||
      !error.response
    ) {
      console.log('[GLOBAL LOGOUT]');

      // stop realtime safely
      realtimeService.disconnect();

      // clear auth
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('role');
      await SecureStore.deleteItemAsync('email');

      // navigate safely
      router.replace('/login');
    }

    return Promise.reject(error);
  }
);
