import { loginDoctor } from "@/API/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authStorage } from "@/services/authStorage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/AppColors";

interface FormData {
  civilID: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    civilID: "",
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
    const civilID = formData.civilID.trim();
    const password = formData.password.trim();

    if (!civilID || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    console.log(`🔐 Attempting login with Civil ID: ${civilID}`);

    try {
      const response = await loginDoctor(civilID, password);

      console.log("🌐 API Response:", response);

      if (response.success && response.data) {
        await authStorage.login(response.data.token, response.data);
        console.log("✅ Login successful:", response.data);

        Alert.alert(
          "Login Successful",
          `Welcome back, Dr. ${response.data.name}!`,
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        console.warn("❌ Login failed:", response.error);
        Alert.alert(
          "Login Failed",
          response.error ||
            "Invalid credentials. Make sure your Civil ID and password are correct and that you have registered."
        );
      }
    } catch (error) {
      console.error("💥 Login error:", error);
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
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/download.png')}
              style={{ width: 150, height: 150, alignSelf: 'center', marginBottom: 32, marginTop: 32 }}
              resizeMode="contain"
            />
            <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Label>Civil ID</Label>
                <Input
                  value={formData.civilID}
                  onChangeText={(value) => handleInputChange("civilID", value)}
                  placeholder="Enter your Civil ID"
                  autoCapitalize="none"
                  keyboardType="default" // ✅ use normal keyboard
                  style={{ width: '100%' }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Password</Label>
                <Input
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  placeholder="Enter your password"
                  secureTextEntry
                  style={{ width: '100%' }}
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 36,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
  },
  formContainer: {
    paddingHorizontal: 0,
    width: '100%',
  },
  form: {
    gap: 24,
    width: '100%',
  },
  inputGroup: {
    gap: 12,
  },
  submitButton: {
    marginTop: 16,
    width: '95%',
    height: 56,
    alignSelf: 'center',
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
});
