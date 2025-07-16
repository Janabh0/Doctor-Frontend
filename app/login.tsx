import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    if (!formData.civilId || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // TODO: Implement backend login logic here
    console.log("Login attempt:", {
      civilId: formData.civilId,
      password: formData.password,
    });

    // Navigate to home page after successful login
    router.push("/(tabs)");
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
                title="Login"
                onPress={handleLogin}
                style={styles.submitButton}
              />

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
});
