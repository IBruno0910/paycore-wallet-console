import axios from "axios";
import { env } from "../config/env";
import { clearAuthSession, getAuthToken } from "../features/auth/auth.storage";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);