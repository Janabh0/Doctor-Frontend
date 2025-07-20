import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DebugScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApiConnection = async (url: string) => {
    try {
      addResult(`Testing connection to: ${url}`);
      
      // Test with a simple GET request to check if server is reachable
      const response = await fetch(`${url}/api/providers/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        addResult(`✅ SUCCESS! Server is reachable at ${url}`);
      } else {
        addResult(`❌ Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addResult(`❌ Connection failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    addResult('🚀 Starting API connection tests...');
    
    // Test different URLs for different environments
    const testUrls = [
      'http://10.0.2.2:5000',  // Android Emulator
      'http://localhost:5000',  // iOS Simulator
      'http://192.168.1.105:5000', // Physical device (your IP)
      'http://127.0.0.1:5000',  // Localhost alternative
    ];

    for (const url of testUrls) {
      await testApiConnection(url);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }
    
    addResult('🏁 All tests completed!');
    setIsTesting(false);
  };

  const testLogin = async () => {
    setIsTesting(true);
    addResult('🔐 Testing login endpoint availability...');
    
    try {
      // Just test if the login endpoint exists and is reachable
      const response = await fetch('http://10.0.2.2:5000/api/providers/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        addResult('✅ Login endpoint is available and reachable');
      } else {
        addResult(`❌ Login endpoint error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addResult(`❌ Login endpoint error: ${error.message}`);
    }
    
    setIsTesting(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00d4aa', marginBottom: 20 }}>
        🔧 API Debug Tool
      </Text>
      
      <Text style={{ color: '#ffffff', marginBottom: 20, lineHeight: 20 }}>
        This tool will test different API URLs to find which one works with your setup.
      </Text>

      <TouchableOpacity
        onPress={runAllTests}
        disabled={isTesting}
        style={{
          backgroundColor: isTesting ? '#666' : '#00d4aa',
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
          {isTesting ? '🔄 Testing...' : '🧪 Run All API Tests'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testLogin}
        disabled={isTesting}
        style={{
          backgroundColor: isTesting ? '#666' : '#007AFF',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>
          🔐 Test Login Endpoint
        </Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: '#2a2a2a', padding: 15, borderRadius: 10 }}>
        <Text style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: 10 }}>
          Test Results:
        </Text>
        {testResults.map((result, index) => (
          <Text key={index} style={{ color: '#cccccc', fontSize: 12, marginBottom: 5 }}>
            {result}
          </Text>
        ))}
        {testResults.length === 0 && (
          <Text style={{ color: '#666666', fontStyle: 'italic' }}>
            No tests run yet. Tap "Run All API Tests" to start.
          </Text>
        )}
      </View>

      <View style={{ marginTop: 20, backgroundColor: '#2a2a2a', padding: 15, borderRadius: 10 }}>
        <Text style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: 10 }}>
          📋 Troubleshooting Tips:
        </Text>
        <Text style={{ color: '#cccccc', fontSize: 12, marginBottom: 5 }}>
          • Make sure your backend is running on port 5000
        </Text>
        <Text style={{ color: '#cccccc', fontSize: 12, marginBottom: 5 }}>
          • Check if your backend has CORS enabled
        </Text>
        <Text style={{ color: '#cccccc', fontSize: 12, marginBottom: 5 }}>
          • For Android emulator, use 10.0.2.2:5000
        </Text>
        <Text style={{ color: '#cccccc', fontSize: 12, marginBottom: 5 }}>
          • For physical device, use your computer's IP address
        </Text>
      </View>
    </ScrollView>
  );
} 