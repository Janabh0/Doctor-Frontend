import { getDoctorAppointments } from "@/API/doctorAppointments";
import { authStorage } from "@/services/authStorage";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TestConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || "http://192.168.8.189:5000";

  const testEndpoints = async () => {
    setIsLoading(true);
    setTestResults([]);

    addResult("🔍 Testing available endpoints...");

    const endpoints = [
      "/api/providers/auth/login",
      "/appointments/doctor",
      "/appointments",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
          addResult(`❌ ${endpoint}: 404 Not Found`);
        } else if (response.status === 405) {
          addResult(
            `⚠️ ${endpoint}: 405 Method Not Allowed (endpoint exists but GET not allowed)`
          );
        } else {
          addResult(
            `✅ ${endpoint}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        addResult(
          `❌ ${endpoint}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    setIsLoading(false);
  };

  const testAppointments = async () => {
    setIsLoading(true);
    setTestResults([]);

    addResult("🔍 Testing appointments functionality...");

    try {
      const token = await authStorage.getAuthToken();
      const userData = await authStorage.getUserData();

      if (!token || !userData) {
        addResult("❌ Auth token or user data missing. Please login first.");
        setIsLoading(false);
        return;
      }

      const response = await getDoctorAppointments();

      if (response.success) {
        const appointments = response.data || [];
        addResult(
          `✅ Appointments test: SUCCESS - Found ${appointments.length} appointments`
        );
      } else {
        addResult(`❌ Appointments test: ${response.error}`);
      }
    } catch (error) {
      addResult(
        `💥 Appointments test failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showBackendInfo = () => {
    Alert.alert(
      "Backend Info",
      `Current API URL: ${apiUrl}\n\nVerify your backend server.`,
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Backend Connection Test</Text>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testEndpoints}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Testing..." : "Test Endpoints"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary, isLoading && styles.buttonDisabled]}
        onPress={testAppointments}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Testing..." : "Test Appointments"}
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
        {testResults.map((result, idx) => (
          <Text key={idx} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4DA8DA",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: "#10b981",
  },
  buttonInfo: {
    backgroundColor: "#6b7280",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  resultsContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
});
