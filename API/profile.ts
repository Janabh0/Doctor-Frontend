import { UserData } from "../services/authStorage";
import instance from "./index";

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get provider profile by ID
 */
export const getProviderProfile = async (id: string): Promise<ApiResponse<UserData>> => {
  try {
    const { data } = await instance.get(`/api/providers/${id}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("getProviderProfile error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Update provider profile by ID
 */
export const updateProviderProfile = async <T = UserData>(
  id: string,
  updates: Partial<UserData & { profileImage?: File | string }>
): Promise<ApiResponse<T>> => {
  try {
    const formData = new FormData();

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const { data } = await instance.put(`/api/providers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("updateProviderProfile error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Delete provider by ID
 */
export const deleteProviderProfile = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    await instance.delete(`/api/providers/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("deleteProviderProfile error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
