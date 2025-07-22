import { apiService } from "@/services/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DoctorRegistrationData {
  name: string;
  email: string;
  phoneNum: string;
  civilID: string;
  password: string;
  confirmPassword: string;
  specialization: string;
  licenseNum: string;
  YOEX: number;
  hospitalOrClinicName?: string;
}

// 🔷 Login Doctor
export const loginDoctor = async (
  civilID: string,
  password: string
): Promise<ApiResponse> => {
  return await apiService.login(civilID, password);
};

// 🔷 Register Doctor
export const registerDoctor = async (
  doctorData: DoctorRegistrationData
): Promise<ApiResponse> => {
  return await apiService.registerDoctor(doctorData);
};
