import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const BASE_URL = "http://192.168.8.189:5000"; // ✅ your backend server IP

export default function DebugScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const fetchWithTimeout = async (
    resource: RequestInfo,
    options: RequestInit = {},
    timeout = 5000
  ) => {
    return Promise.race([
      fetch(resource, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), timeout)
      ),
    ]);
  };

  const testApiHealth = async () => {
    try {
      addResult(`🌐 Testing API health at ${BASE_URL}`);
      const response = await fetchWithTimeout(
        `${BASE_URL}/api/health`,
        { method: "GET" },
        5000
      ) as Response;

      if (response.ok) {
        addResult("✅ API health check passed!");
      } else {
        addResult(`❌ API health error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addResult(`❌ API health check failed: ${error.message}`);
    }
  };

  const testLoginEndpoint = async () => {
    try {
      addResult("🔐 Testing login endpoint...");
      const response = await fetchWithTimeout(
        `${BASE_URL}/api/providers/auth/login`,
        {
          method: "OPTIONS", // Just checking if it responds
          headers: { "Content-Type": "application/json" },
        },
        5000
      ) as Response;

      if (response.ok) {
        addResult("✅ Login endpoint is available.");
      } else {
        addResult(`❌ Login endpoint error: ${response.status} ${response.statusText}`);
      }
    } catch (error: any) {
      addResult(`❌ Login endpoint failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    addResult("🚀 Starting all API tests...");
    await testApiHealth();
    await new Promise((r) => setTimeout(r, 1000));
    await testLoginEndpoint();

    addResult("🏁 All tests completed!");
    setIsTesting(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1a1a1a", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#00d4aa", marginBottom: 20 }}>
        🔧 API Debug Tool
      </Text>

      <Text style={{ color: "#ffffff", marginBottom: 20, lineHeight: 20 }}>
        This tool tests your OnCall backend at <Text style={{ color: "#00d4aa" }}>{BASE_URL}</Text>
      </Text>

      <TouchableOpacity
        onPress={runAllTests}
        disabled={isTesting}
        style={{
          backgroundColor: isTesting ? "#666" : "#00d4aa",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          {isTesting ? "🔄 Testing..." : "🧪 Run All Tests"}
        </Text>
      </TouchableOpacity>

      <View style={{ backgroundColor: "#2a2a2a", padding: 15, borderRadius: 10 }}>
        <Text style={{ color: "#ffffff", fontWeight: "bold", marginBottom: 10 }}>
          Test Results:
        </Text>
        {testResults.map((result, index) => (
          <Text key={index} style={{ color: "#cccccc", fontSize: 12, marginBottom: 5 }}>
            {result}
          </Text>
        ))}
        {testResults.length === 0 && (
          <Text style={{ color: "#666666", fontStyle: "italic" }}>
            No tests yet. Tap "Run All Tests" to start.
          </Text>
        )}
      </View>

      <View style={{ marginTop: 20, backgroundColor: "#2a2a2a", padding: 15, borderRadius: 10 }}>
        <Text style={{ color: "#ffffff", fontWeight: "bold", marginBottom: 10 }}>
          📋 Troubleshooting Tips:
        </Text>
        <Text style={{ color: "#cccccc", fontSize: 12, marginBottom: 5 }}>
          • Backend must be running at port 5000
        </Text>
        <Text style={{ color: "#cccccc", fontSize: 12, marginBottom: 5 }}>
          • CORS enabled on backend
        </Text>
        <Text style={{ color: "#cccccc", fontSize: 12, marginBottom: 5 }}>
          • Phone must be on the same Wi-Fi
        </Text>
      </View>
    </ScrollView>
  );
}
