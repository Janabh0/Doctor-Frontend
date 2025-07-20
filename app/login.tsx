import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { apiService } from "@/services/api";
import { authStorage } from "@/services/authStorage";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { AppColors } from "../constants/AppColors";


interface FormData {
  civilId: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    civilId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.civilId || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    console.log("🔐 Attempting login with Civil ID:", formData.civilId);

    try {
      const response = await apiService.login(formData.civilId, formData.password);

      if (response.success && response.data) {
        // Store authentication data
        await authStorage.login(response.data.token, response.data);
        console.log("✅ Login successful:", response.data);
        
        // Show success message
        Alert.alert(
          "Login Successful", 
          `Welcome back, Dr. ${response.data.name}!`,
          [
            {
              text: "Continue",
              onPress: () => router.push("/(tabs)")
            }
          ]
        );
      } else {
        console.log("❌ Login failed:", response.error);
        Alert.alert("Login Failed", response.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log("💥 Login error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Label>Civil ID</Label>
                <Input
                  value={formData.civilId}
                  onChangeText={(value) => handleInputChange("civilId", value)}
                  placeholder="Enter your Civil ID"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Password</Label>
                <Input
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  placeholder="Enter your password"
                  secureTextEntry
                />
              </View>

              <Button
                title={loading ? "Signing In..." : "Login"}
                onPress={handleLogin}
                style={styles.submitButton}
                disabled={loading}
              />

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={AppColors.primary} />
                  <Text style={styles.loadingText}>Signing you in...</Text>
                </View>
              )}

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => router.push("/debug" as any)}
              >
                <Text style={styles.registerLinkText}>
                  🔧 Test Backend Connection
                </Text>
              </TouchableOpacity>


            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 50,
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 0,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 16,
  },
  registerLinkText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerLinkBold: {
    color: AppColors.primary,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },

});
