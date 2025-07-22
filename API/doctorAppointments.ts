import instance from ".";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Appointment {
  _id: string;
  date: string;
  time: string | number;
  type: string;
  status: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  patient?: {
    _id: string;
    name: string;
    gender?: string;
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
  };
}

// Hardcode the allAppointments array with both online and offline appointments
export const allAppointments: any[] = [
  {
    _id: 'a1',
    patient: { _id: 'p1', name: 'Ahmad Al-Farsi', gender: 'male' },
    doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
    date: '2025-07-26',
    time: '09:00',
    type: 'online',
    status: 'confirmed',
    createdAt: '2025-07-26T08:00:00Z',
    updatedAt: '2025-07-26T08:00:00Z',
  },
  {
    _id: 'a2',
    patient: { _id: 'p2', name: 'Fatima Al-Sabah', gender: 'female' },
    doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
    date: '2025-07-27',
    time: '11:30',
    type: 'offline',
    status: 'pending',
    createdAt: '2025-07-27T10:00:00Z',
    updatedAt: '2025-07-27T10:00:00Z',
  },
  {
    _id: 'a3',
    patient: { _id: 'p3', name: 'Layla Al-Mutairi', gender: 'female' },
    doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
    date: '2025-07-28',
    time: '14:00',
    type: 'online',
    status: 'pending',
    createdAt: '2025-07-28T13:00:00Z',
    updatedAt: '2025-07-28T13:00:00Z',
  },
  {
    _id: 'a4',
    patient: { _id: 'p4', name: 'Yousef Al-Sabah', gender: 'male' },
    doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
    date: '2025-07-26',
    time: '16:00',
    type: 'offline',
    status: 'confirmed',
    createdAt: '2025-07-26T15:00:00Z',
    updatedAt: '2025-07-26T15:00:00Z',
  },
];

// ✅ Get all appointments for logged-in doctor
export const getDoctorAppointments = async (): Promise<ApiResponse<Appointment[]>> => {
  try {
    const { data } = await instance.get("/api/appointments/doctor");
    return { success: true, data };
  } catch (error: any) {
    console.error("getDoctorAppointments error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// ✅ Get a specific appointment by ID
export const getDoctorAppointmentById = async (
  appointmentID: string
): Promise<ApiResponse<Appointment>> => {
  try {
    const { data } = await instance.get(`/api/appointments/${appointmentID}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("getDoctorAppointmentById error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// ✅ Get a patient by ID
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

export const getPatientById = async (
  patientID: string
): Promise<ApiResponse<Patient>> => {
  try {
    const { data } = await instance.get(`/api/patients/${patientID}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("getPatientById error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// 🟢 Update appointment status
export const updateAppointmentStatus = async (
  appointmentID: string,
  status: string
): Promise<ApiResponse<Appointment>> => {
  try {
    const { data } = await instance.put(`/api/appointments/${appointmentID}/status`, { status });
    return { success: true, data };
  } catch (error: any) {
    console.error("updateAppointmentStatus error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// 🟢 Delete appointment
export const deleteAppointment = async (
  appointmentID: string
): Promise<ApiResponse> => {
  try {
    const { data } = await instance.delete(`/api/appointments/${appointmentID}`);
    return { success: true, data };
  } catch (error: any) {
    console.error("deleteAppointment error:", error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};
