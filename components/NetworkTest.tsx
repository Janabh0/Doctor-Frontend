import { apiService } from '@/services/api';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColors } from '../constants/AppColors';

export const NetworkTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setTesting(true);
    setResult('');

    try {
      const isConnected = await apiService.testConnection();
      if (isConnected) {
        setResult('✅ Connection successful! API server is responding.');
      } else {
        setResult('❌ Network Error: Could not connect to API server.');
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const showApiUrl = () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.8.189:5000';
    console.log('🔗 Current API URL:', apiUrl);
    Alert.alert(
      'API URL Info',
      `Current API URL: ${apiUrl}\n\nCheck the console for more details.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Connection Test</Text>

      <TouchableOpacity
        style={styles.testButton}
        onPress={testConnection}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test API Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.infoButton}
        onPress={showApiUrl}
      >
        <Text style={styles.infoButtonText}>Show API URL</Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}

      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Troubleshooting Tips:</Text>
        <Text style={styles.helpText}>• Check if your API server is running</Text>
        <Text style={styles.helpText}>• Verify the API URL in services/api.ts</Text>
        <Text style={styles.helpText}>• Ensure device and server are on same network</Text>
        <Text style={styles.helpText}>• For physical device: use your computer's IP address</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: AppColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  infoButton: {
    backgroundColor: '#6b7280',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
});
