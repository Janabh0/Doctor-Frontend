import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStorage } from "../services/authStorage";
import { CONFIG } from "../services/config";

// Create Axios instance
const instance = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: CONFIG.API_TIMEOUT,
});

// Request interceptor
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await authStorage.getAuthToken();

    if (token) {
      // Axios v1.x uses .set, fallback for older versions
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (CONFIG.DEBUG) {
      console.log(
        `%c📤 [${config.method?.toUpperCase()}] ${config.url}`,
        "color: green",
        config.data ?? ""
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    if (CONFIG.DEBUG) {
      console.log(
        `%c✅ [${response.status}] ${response.config.url}`,
        "color: blue",
        response.data
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const message =
      (error.response?.data as any)?.message || error.message;

    console.error(
      `❌ Response Error: [${status}] ${message}`,
      error.response?.data
    );

    if (status === 401) {
      await authStorage.clearAuth();
      console.warn("⚠️ Token expired. Cleared auth data.");
      // TODO: implement redirect to login or refresh-token flow here
    }

    return Promise.reject(error);
  }
);

export default instance;
