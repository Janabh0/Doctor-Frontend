import axios from 'axios';

const API_BASE_URL = 'http://<your-local-ip>:5000/api/providers';

// export const registerDoctor = async (formData: FormData) => {
//   const response = await axios.post(`${API_BASE_URL}/auth/register/doctor`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

export const loginDoctor = async (civilID: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { civilID, password });
  return response.data;
};
