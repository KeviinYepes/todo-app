import axios from 'axios';

export const AUTH_TOKEN_STORAGE_KEY = 'todo_access_token';

export const backendApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: backendApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export function storeAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function getStoredAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function clearStoredAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
