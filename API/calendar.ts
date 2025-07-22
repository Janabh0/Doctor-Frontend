import instance from ".";

/**
 * Redirects to Google OAuth2 URL
 */
export const getGoogleOAuthURL = () => {
  return `${instance.defaults.baseURL}/google`;
};

/**
 * Exchange OAuth2 callback code for tokens
 */
export const exchangeGoogleCodeForTokens = async (code: string) => {
  try {
    const { data } = await instance.get(`/google/callback?code=${code}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("exchangeGoogleCodeForTokens error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};
