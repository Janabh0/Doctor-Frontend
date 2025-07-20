import { apiService } from '@/services/api';
import { authStorage } from '@/services/authStorage';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TestConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('🔍 Testing basic connectivity...');
      const connectivityResult = await apiService.testBasicConnectivity();
      
      if (connectivityResult.success) {
        addResult('✅ Basic connectivity: SUCCESS');
      } else {
        addResult(`❌ Basic connectivity: ${connectivityResult.error}`);
      }

      addResult('🔍 Testing server health...');
      const healthResult = await apiService.testServerHealth();
      
      if (healthResult.success) {
        addResult('✅ Server health: SUCCESS');
      } else {
        addResult(`❌ Server health: ${healthResult.error}`);
      }

    } catch (error) {
      addResult(`💥 Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEndpoints = async () => {
    setIsLoading(true);
    addResult('🔍 Testing available endpoints...');
    
    const endpoints = [
      '/api/providers/auth/login',
      '/api/providers/auth/register/doctor',
      '/api/providers/auth/update',
      '/api/providers/profile/update',
      '/api/providers/auth/profile',
      '/api/providers/auth/upload-image',
      '/api/providers/profile/upload',
      '/api/providers/auth/profile-image',
      '/appointments/doctor',
      '/appointments',
    ];

    for (const endpoint of endpoints) {
      try {
        addResult(`🔍 Testing ${endpoint}...`);
        const response = await fetch(`http://192.168.8.189:5000${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 404) {
          addResult(`❌ ${endpoint}: 404 Not Found`);
        } else if (response.status === 405) {
          addResult(`⚠️ ${endpoint}: 405 Method Not Allowed (endpoint exists but GET not allowed)`);
        } else {
          addResult(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        addResult(`❌ ${endpoint}: ${error}`);
      }
    }
    
    setIsLoading(false);
  };

  const testProfileUpdate = async () => {
    setIsLoading(true);
    addResult('🔍 Testing profile update...');
    
    try {
      const token = await authStorage.getAuthToken();
      if (!token) {
        addResult('❌ No authentication token found. Please login first.');
        setIsLoading(false);
        return;
      }

      const userData = await authStorage.getUserData();
      if (!userData) {
        addResult('❌ No user data found. Please login first.');
        setIsLoading(false);
        return;
      }

      addResult(`🔍 Testing update for user: ${userData._id}`);
      
      // Test with a simple update
      const testUpdate = {
        email: userData.email, // Keep the same email for testing
        phone: userData.phoneNum, // Keep the same phone for testing
      };

      const response = await apiService.updateDoctorProfile(token, userData._id, testUpdate);
      
      if (response.success) {
        addResult('✅ Profile update test: SUCCESS');
      } else {
        addResult(`❌ Profile update test: ${response.error}`);
      }

    } catch (error) {
      addResult(`💥 Profile update test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAppointments = async () => {
    setIsLoading(true);
    addResult('🔍 Testing appointments functionality...');
    
    try {
      const token = await authStorage.getAuthToken();
      if (!token) {
        addResult('❌ No authentication token found. Please login first.');
        setIsLoading(false);
        return;
      }

      const userData = await authStorage.getUserData();
      if (!userData) {
        addResult('❌ No user data found. Please login first.');
        setIsLoading(false);
        return;
      }

      addResult(`🔍 Testing appointments for user: ${userData._id}`);
      
      // Test appointments endpoint
      const response = await apiService.getDoctorAppointments(token);
      
      if (response.success) {
        const appointments = response.data || [];
        addResult(`✅ Appointments test: SUCCESS - Found ${appointments.length} appointments`);
        
        if (appointments.length > 0) {
          const firstAppointment = appointments[0];
          addResult(`📋 Sample appointment:`);
          addResult(`   - ID: ${firstAppointment._id}`);
          addResult(`   - Date: ${firstAppointment.date}`);
          addResult(`   - Time: ${firstAppointment.time}`);
          addResult(`   - Type: ${firstAppointment.type}`);
          addResult(`   - Status: ${firstAppointment.status}`);
          addResult(`   - Patient: ${firstAppointment.patient?.name || 'No patient data'}`);
        } else {
          addResult('📋 No appointments found in the database');
        }
      } else {
        addResult(`❌ Appointments test: ${response.error}`);
      }

    } catch (error) {
      addResult(`💥 Appointments test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testNetworkConnectivity = async () => {
    setIsLoading(true);
    addResult('🔍 Testing network connectivity...');
    
    const apiUrl = 'http://192.168.8.189:5000';
    addResult(`🌐 Testing connection to: ${apiUrl}`);
    
    try {
      // Test 1: Basic fetch to the server
      addResult('🔍 Test 1: Basic server connection...');
      const response = await fetch(`${apiUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        addResult(`✅ Server is reachable: ${response.status} ${response.statusText}`);
      } else {
        addResult(`⚠️ Server responded with: ${response.status} ${response.statusText}`);
      }
      
      // Test 2: Check if the API endpoints exist
      addResult('🔍 Test 2: Checking API endpoints...');
      const endpoints = [
        '/api/providers/auth/login',
        '/appointments/doctor',
        '/appointments',
      ];
      
      for (const endpoint of endpoints) {
        try {
          const endpointResponse = await fetch(`${apiUrl}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (endpointResponse.status === 404) {
            addResult(`❌ ${endpoint}: 404 Not Found`);
          } else if (endpointResponse.status === 405) {
            addResult(`⚠️ ${endpoint}: 405 Method Not Allowed (exists but GET not allowed)`);
          } else {
            addResult(`✅ ${endpoint}: ${endpointResponse.status} ${endpointResponse.statusText}`);
          }
        } catch (error) {
          addResult(`❌ ${endpoint}: ${error}`);
        }
      }
      
      // Test 3: Try with different timeout
      addResult('🔍 Test 3: Testing with longer timeout...');
      const timeoutResponse = await fetch(`${apiUrl}/api/providers/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      addResult(`✅ Timeout test: ${timeoutResponse.status} ${timeoutResponse.statusText}`);
      
         } catch (error) {
       const errorMessage = error instanceof Error ? error.message : String(error);
       addResult(`❌ Network test failed: ${errorMessage}`);
       
       // Provide specific troubleshooting tips
       if (errorMessage.includes('timeout')) {
        addResult('💡 Troubleshooting tips:');
        addResult('   • Check if phone and laptop are on same Wi-Fi');
        addResult('   • Verify Windows Firewall allows port 5000');
        addResult('   • Try restarting the backend server');
             } else if (errorMessage.includes('Network request failed')) {
        addResult('💡 Troubleshooting tips:');
        addResult('   • Check your internet connection');
        addResult('   • Verify the IP address is correct');
        addResult('   • Try using localhost instead of IP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testPortConnection = async () => {
    setIsLoading(true);
    addResult('🔍 Testing port 5001 to 5000 connection...');
    
          const backendUrl = 'http://192.168.13.143:5000';
    addResult(`🌐 Expo (5001) → Backend (5000): ${backendUrl}`);
    addResult('📱 Frontend: Port 5001 (Expo Dev Server)');
    addResult('🖥️ Backend: Port 5000 (Node.js/Express)');
    
    try {
      // Test 1: Basic connectivity
      addResult('🔍 Test 1: Basic connectivity...');
      const startTime = Date.now();
      const response = await fetch(`${backendUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      addResult(`⏱️ Response time: ${responseTime}ms`);
      
      if (response.ok) {
        addResult(`✅ Connection successful: ${response.status} ${response.statusText}`);
      } else {
        addResult(`⚠️ Server responded: ${response.status} ${response.statusText}`);
      }
      
      // Test 2: Check if server is actually the backend
      addResult('🔍 Test 2: Verifying backend server...');
      try {
        const serverInfo = await response.text();
        if (serverInfo.includes('Server is running') || serverInfo.includes('oncall') || serverInfo.includes('api')) {
          addResult('✅ Backend server confirmed');
        } else {
          addResult('⚠️ Response doesn\'t look like our backend');
        }
      } catch (e) {
        addResult('⚠️ Could not read server response');
      }
      
      // Test 3: Test specific API endpoint
      addResult('🔍 Test 3: Testing API endpoint...');
      const apiResponse = await fetch(`${backendUrl}/api/providers/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (apiResponse.status === 405) {
        addResult('✅ API endpoint exists (405 Method Not Allowed is expected for GET)');
      } else if (apiResponse.status === 404) {
        addResult('❌ API endpoint not found');
      } else {
        addResult(`⚠️ API endpoint responded: ${apiResponse.status} ${apiResponse.statusText}`);
      }
      
      addResult('🎉 Port connection test completed successfully!');
      addResult('💡 Your setup is working correctly!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addResult(`❌ Port connection failed: ${errorMessage}`);
      
      // Provide specific troubleshooting tips
      addResult('💡 Troubleshooting tips:');
      addResult('   • Check if both devices are on same Wi-Fi network');
      addResult('   • Verify Windows Firewall allows port 5000');
      addResult('   • Try restarting the backend server');
      addResult('   • Check if IP address 192.168.8.189 is correct');
      addResult('   • Try running: ipconfig in CMD to verify IP');
    } finally {
      setIsLoading(false);
    }
  };

  const showBackendInfo = () => {
    Alert.alert(
      'Backend Information',
      `Current API URL: http://192.168.8.189:5000\n\nPlease check your backend server and ensure it has the following routes:\n\n• PUT /api/providers/auth/update\n• PUT /api/providers/profile/update\n• PUT /api/providers/auth/profile\n• PUT /api/providers/auth/upload-image\n\nOr provide the correct endpoint structure.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Backend Connection Test</Text>
      <Text style={styles.subtitle}>Testing connection to: 192.168.13.143:5000</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Basic Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testEndpoints}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test All Endpoints'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testProfileUpdate}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Profile Update'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testAppointments}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Appointments'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testNetworkConnectivity}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Network Connectivity'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testPortConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Port 8081 to 5000'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.buttonInfo]}
        onPress={showBackendInfo}
      >
        <Text style={styles.buttonText}>Show Backend Info</Text>
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#4DA8DA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonSecondary: {
    backgroundColor: '#10b981',
  },
  buttonInfo: {
    backgroundColor: '#6b7280',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 12,
    marginBottom: 3,
    color: '#666',
    fontFamily: 'monospace',
  },
}); 