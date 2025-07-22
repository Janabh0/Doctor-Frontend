const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.6.209:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  civilID: string;
  specialization: string;
  licenseNum: string;
  YOEX: number;
  hospitalOrClinicName?: string;
  phoneNum: string;
  token: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  patient?: {
    _id: string;
    name: string;
    gender: string;
    phoneNum?: string;
    dependents?: {
      _id: string;
      name: string;
      relation: string;
    }[];
  };
  doctor?: {
    _id: string;
    name: string;
    speciality: string;
    licenseNum?: string;
  };
  date: string;
  time: string | number;
  type: string;
  status: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  meetingLink?: string;
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

export interface DoctorRegistrationResponse {
  _id: string;
  name: string;
  email: string;
  phoneNum: string;
  civilID: string;
  specialization: string;
  licenseNum: string;
  YOEX: number;
  hospitalOrClinicName?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.message || `HTTP error ${response.status}`);
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  // 🩺 Doctor Registration
  async registerDoctor(
    data: DoctorRegistrationData
  ): Promise<ApiResponse<DoctorRegistrationResponse>> {
    return this.request("/providers/auth/register/doctor", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 🔐 Login
  async login(
    civilId: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> {
    return this.request("/providers/auth/login", {
      method: "POST",
      body: JSON.stringify({ civilId, password }),
    });
  }
  // 📆 Get Doctor Appointments
  async getDoctorAppointments(
    token: string
  ): Promise<ApiResponse<Appointment[]>> {
    return this.request("/appointments/doctor", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // 📆 Get Patient by ID
  async getPatientById(patientId: string): Promise<ApiResponse<any>> {
    return this.request(`/patients/${patientId}`, { method: "GET" });
  }

  // 🩺 Update Doctor Profile
  async updateDoctorProfile(
    token: string,
    doctorId: string,
    updates: Record<string, any>
  ): Promise<ApiResponse<any>> {
    return this.request(`/providers/${doctorId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  }

  // 📷 Upload Profile Image
  async uploadProfileImage(
    token: string,
    doctorId: string,
    imageUri: string
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("profileImage", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile-image.jpg",
    } as any);

    return this.request(`/providers/${doctorId}/image`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData as any,
    });
  }

  // 🔍 Test Server Health
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/providers`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

