// API Configuration
// IMPORTANT: Change this to your actual API server URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.13.143:5000';

// For different environments:
// Android Emulator: http://10.0.2.2:5000
// iOS Simulator: http://localhost:5000
// Physical iOS Device: http://YOUR_COMPUTER_IP:5000 (replace with your actual IP)
// Physical Android Device: http://YOUR_COMPUTER_IP:5000 (replace with your actual IP)

// To find your computer's IP address:
// Windows: Run "ipconfig" in CMD
// Mac: Run "ifconfig" in Terminal
// Look for IPv4 address like: 192.168.1.100

// API Response Types
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
    email: string;
    phoneNum: string;
  };
  doctor?: {
    _id: string;
    name: string;
    speciality: string;
    licenseNum: string;
  };
  date: string;
  time: string | number; // Can be string or number
  type: string;
  status: string;
  duration?: number; // Your DB has this
  notes?: string[]; // Your DB has this
  createdAt: string;
  updatedAt: string;
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

// API Service Class
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
      console.log('🌐 Making API request to:', url);
      console.log('📤 Request body:', options.body);
      console.log('📋 Request headers:', options.headers);
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 60000); // 60 second timeout
      });

      // Create the fetch promise
      const fetchPromise = fetch(url, {
        ...options,
        headers: defaultHeaders,
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      
      // Get response text first to handle both JSON and text responses
      const responseText = await response.text();
      console.log('📥 Raw response text:', responseText);
      
      let data;
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
        console.log('📥 Parsed JSON data:', data);
      } catch (parseError) {
        // If not JSON, use the text as data
        console.log('📥 Response is not JSON, using as text');
        data = responseText;
      }

      if (!response.ok) {
        // For internal server errors, log more details
        if (response.status === 500) {
          console.error('🔥 Internal Server Error Details:');
          console.error('🔥 Status:', response.status);
          console.error('🔥 Status Text:', response.statusText);
          console.error('🔥 Response Body:', responseText);
          console.error('🔥 URL:', url);
          console.error('🔥 Headers:', defaultHeaders);
        }
        
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('❌ API request failed:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        if (error.message === 'Request timeout') {
          errorMessage = 'Request timeout. Please check your internet connection.';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Cannot connect to server. Please check:\n• Your internet connection\n• API server is running\n• Correct API URL is configured';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Doctor Registration
  async registerDoctor(data: DoctorRegistrationData): Promise<ApiResponse<DoctorRegistrationResponse>> {
    return this.request<DoctorRegistrationResponse>('/api/providers/auth/register/doctor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Test basic server connectivity
  async testBasicConnectivity(): Promise<ApiResponse<any>> {
    try {
      console.log('🌐 Testing basic connectivity to server...');
      console.log('🌐 Server URL:', this.baseURL);
      
      // Try the login endpoint since we know it exists
      const response = await fetch(`${this.baseURL}/api/providers/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Basic connectivity response:', response.status, response.statusText);
      
      // 404 is expected for GET on login endpoint, but it means server is reachable
      if (response.status === 404) {
        return { 
          success: true, 
          data: { 
            message: 'Server is reachable (404 expected for GET on login endpoint)',
            status: response.status
          } 
        };
      } else if (response.ok) {
        return { 
          success: true, 
          data: { 
            message: 'Server is reachable',
            status: response.status
          } 
        };
      } else {
        return { 
          success: false, 
          error: `Server responded with ${response.status}: ${response.statusText}` 
        };
      }
      
    } catch (error) {
      console.error('❌ Basic connectivity test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Cannot reach server' 
      };
    }
  }

  // Test server health
  async testServerHealth(): Promise<ApiResponse<any>> {
    try {
      console.log('🏥 Testing server health...');
      
      const healthEndpoints = [
        '/api/providers/auth/login',  // We know this exists
        '/api/appointments',          // Appointments base
        '/api/providers',             // Providers base
        '/api'                        // API base
      ];
      
      for (const endpoint of healthEndpoints) {
        try {
          console.log(`🏥 Testing health endpoint: ${endpoint}`);
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log(`📥 Health ${endpoint}: ${response.status} ${response.statusText}`);
          
          // 404 is expected for GET requests on POST endpoints, but means server is reachable
          if (response.status === 404) {
            return { 
              success: true, 
              data: { 
                message: `Server is healthy (404 expected for GET on ${endpoint})`,
                status: response.status,
                endpoint
              } 
            };
          } else if (response.ok) {
            return { 
              success: true, 
              data: { 
                message: `Server is healthy at ${endpoint}`,
                status: response.status,
                endpoint
              } 
            };
          }
        } catch (error) {
          console.log(`❌ Health ${endpoint}: Network error`);
        }
      }
      
      return { 
        success: false, 
        error: 'Server health check failed - no endpoints responded' 
      };
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Health check failed' 
      };
    }
  }

  // Login
  async login(civilId: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/providers/auth/login', {
      method: 'POST',
      body: JSON.stringify({ civilId, password }),
    });
  }

  // Test if appointments routes are mounted
  async testAppointmentsRoutesMounted(): Promise<ApiResponse<any>> {
    try {
      console.log('🔍 Testing if appointments routes are mounted...');
      
      // Test the base appointments endpoint without authentication
      // app.use("/appointments", appointmentsRoutes) = /appointments
      const response = await fetch(`${this.baseURL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Appointments base endpoint response:', response.status, response.statusText);
      
      if (response.status === 404) {
        return { 
          success: false, 
          error: 'Appointments routes are not mounted - 404 on /appointments' 
        };
      } else if (response.status === 401) {
        return { 
          success: true, 
          data: { 
            message: 'Appointments routes are mounted (401 expected without auth)',
            status: response.status
          } 
        };
      } else {
        return { 
          success: true, 
          data: { 
            message: 'Appointments routes are mounted and accessible',
            status: response.status
          } 
        };
      }
      
    } catch (error) {
      console.error('❌ Appointments routes test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Cannot test appointments routes' 
      };
    }
  }

  // Test appointments endpoint specifically
  async testAppointmentsEndpoint(): Promise<ApiResponse<any>> {
    try {
      console.log('🧪 Testing appointments endpoint specifically...');
      
      // Test 1: Check if appointments base endpoint exists
      console.log('🧪 Test 1: Checking /appointments endpoint...');
      const baseResponse = await fetch(`${this.baseURL}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Base appointments response:', baseResponse.status, baseResponse.statusText);
      
      // Test 2: Check if /appointments/doctor endpoint exists (without auth)
      console.log('🧪 Test 2: Checking /appointments/doctor endpoint...');
      const doctorResponse = await fetch(`${this.baseURL}/appointments/doctor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Doctor appointments response:', doctorResponse.status, doctorResponse.statusText);
      
      // Test 3: Try to get response body for more details
      try {
        const doctorResponseText = await doctorResponse.text();
        console.log('📥 Doctor appointments response body:', doctorResponseText);
      } catch (e) {
        console.log('📥 Could not read response body');
      }
      
      return {
        success: true,
        data: {
          baseEndpoint: {
            status: baseResponse.status,
            statusText: baseResponse.statusText,
            exists: baseResponse.status !== 404
          },
          doctorEndpoint: {
            status: doctorResponse.status,
            statusText: doctorResponse.statusText,
            exists: doctorResponse.status !== 404
          }
        }
      };
      
    } catch (error) {
      console.error('❌ Appointments endpoint test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cannot test appointments endpoint'
      };
    }
  }

  // Get appointments for logged-in doctor
  async getDoctorAppointments(token: string): Promise<ApiResponse<Appointment[]>> {
    try {
      console.log('🔍 Fetching appointments with token:', token ? 'Token exists' : 'No token');
      
      // Debug: Check token format and decode it to see the role
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('🔍 Token payload:', payload);
            console.log('🔍 User role in token:', payload.role);
            console.log('🔍 Provider ID in token:', payload.providerId);
            console.log('🔍 User ID in token:', payload._id);
          }
        } catch (e) {
          console.log('🔍 Could not decode token payload');
        }
      }
      
      // The correct endpoint based on your backend structure
      // app.use("/appointments", appointmentsRoutes) + router.get("/doctor", ...) = /appointments/doctor
      const endpoint = '/appointments/doctor';
      console.log(`🔄 Trying endpoint: ${endpoint}`);
      
      const response = await this.request<Appointment[]>(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.success) {
        console.log(`✅ Success with endpoint: ${endpoint}`);
        console.log('✅ Appointments fetched successfully:', response.data?.length || 0, 'appointments');
        return response;
      } else {
        console.log(`❌ Failed with endpoint: ${endpoint} - ${response.error}`);
        
        // If it's a server error, try to get more details
        if (response.error?.includes('Internal Server Error')) {
          console.log('🔄 Internal server error detected, trying alternative approaches...');
          
          // Try without the /doctor part
          console.log('🔄 Trying base appointments endpoint...');
          const altResponse = await this.request<Appointment[]>('/appointments', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (altResponse.success) {
            console.log('✅ Success with base appointments endpoint');
            return altResponse;
          } else {
            console.log('❌ Base endpoint also failed:', altResponse.error);
          }
          
          // Try with different authorization header format
          console.log('🔄 Trying with different auth header format...');
          const authResponse = await this.request<Appointment[]>(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (authResponse.success) {
            console.log('✅ Success with modified auth header');
            return authResponse;
          } else {
            console.log('❌ Modified auth header also failed:', authResponse.error);
          }
        }
        
        return response;
      }
      
    } catch (error) {
      console.error('💥 Error in getDoctorAppointments:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error fetching appointments'
      };
    }
  }

  // Update doctor profile information
  async updateDoctorProfile(token: string, doctorId: string, updates: any): Promise<ApiResponse<any>> {
    try {
      console.log('📤 Updating doctor profile for doctor:', doctorId);
      console.log('📤 Updates:', updates);
      
      // Try different endpoint patterns based on the auth structure
      const endpoints = [
        `/api/providers/auth/update`,
        `/api/providers/profile/update`,
        `/api/providers/${doctorId}`,
        `/api/providers/auth/profile`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          const response = await this.request(endpoint, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ...updates, doctorId }),
          });

          if (response.success) {
            console.log(`✅ Doctor profile updated successfully using: ${endpoint}`);
            return response;
          } else {
            console.log(`❌ Failed with endpoint ${endpoint}: ${response.error}`);
          }
        } catch (error) {
          console.log(`❌ Error with endpoint ${endpoint}: ${error}`);
        }
      }

      // If all endpoints fail, return the last error
      return {
        success: false,
        error: 'All update endpoints failed. Please check your backend routes.',
      };
    } catch (error) {
      console.error('❌ Doctor profile update failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error updating doctor profile',
      };
    }
  }

  // Upload profile image
  async uploadProfileImage(token: string, doctorId: string, imageUri: string): Promise<ApiResponse<any>> {
    try {
      console.log('📤 Uploading profile image for doctor:', doctorId);
      
      // Create form data for image upload
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile-image.jpg',
      } as any);
      formData.append('doctorId', doctorId);

      // Try different endpoint patterns
      const endpoints = [
        `/api/providers/auth/upload-image`,
        `/api/providers/profile/upload`,
        `/api/providers/${doctorId}`,
        `/api/providers/auth/profile-image`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying image upload endpoint: ${endpoint}`);
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });

          const responseData = await response.json();
          console.log(`📥 Profile image upload response from ${endpoint}:`, responseData);

          if (response.ok) {
            console.log(`✅ Profile image uploaded successfully using: ${endpoint}`);
            return {
              success: true,
              data: responseData,
            };
          } else {
            console.log(`❌ Failed with endpoint ${endpoint}: ${responseData.message || response.statusText}`);
          }
        } catch (error) {
          console.log(`❌ Error with endpoint ${endpoint}: ${error}`);
        }
      }

      return {
        success: false,
        error: 'All image upload endpoints failed. Please check your backend routes.',
      };
    } catch (error) {
      console.error('❌ Profile image upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error uploading profile image',
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
