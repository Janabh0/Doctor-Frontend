import instance from "./index";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Patient model (as returned from populated `appointment.patient`)
export interface Patient {
  _id: string;
  name: string;
  gender?: string;
  phoneNum?: string;
  dependents?: {
    _id: string;
    name: string;
    relation: string;
  }[];
}

// ✅ Get a single patient by ID (doctor or admin use)
export const fetchPatientById = async (
  patientId: string
): Promise<ApiResponse<Patient>> => {
  try {
    const { data } = await instance.get(`/patients/${patientId}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("fetchPatientById error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
