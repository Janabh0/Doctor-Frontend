export const CONFIG = {
  BACKEND_URL: "http://192.168.6.209:5000/",
  API_TIMEOUT: 10000,
  APP_NAME: "OnCall",
  DEBUG: true, // 👈 added debug flag for logging
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    USER_PROFILE: "user_profile",
    IS_LOGGED_IN: "is_logged_in",
  },
};

/**
 * Helper to build full API URL
 * @param endpoint string - endpoint path (e.g., '/appointments')
 * @returns full URL
 */
export const getApiUrl = (endpoint: string) => {
  const trimmed = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${CONFIG.BACKEND_URL}/${trimmed}`;
};
