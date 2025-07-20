import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { apiService, DoctorRegistrationData } from "@/services/api";
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
    View,
} from "react-native";
import { AppColors } from "../constants/AppColors";

const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Other",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<Omit<DoctorRegistrationData, 'experience'> & { experience: string }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    civilId: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    education: "",
    hospital: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<DoctorRegistrationData>>({});

  const handleInputChange = (field: keyof DoctorRegistrationData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as any,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DoctorRegistrationData> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.civilId.trim()) newErrors.civilId = "Civil ID is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.education.trim()) newErrors.education = "Education is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Experience validation
    const experienceNum = parseInt(formData.experience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      newErrors.experience = "Please enter a valid number of years" as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiData: DoctorRegistrationData = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
      };
      const response = await apiService.registerDoctor(apiData);

      if (response.success) {
        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully. Please log in.",
          [
            {
              text: "OK",
              onPress: () => router.push("/login"),
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", response.error || "An error occurred during registration");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    field: keyof DoctorRegistrationData,
    label: string,
    placeholder: string,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
      multiline?: boolean;
      numberOfLines?: number;
    } = {}
  ) => (
    <View style={styles.inputGroup}>
      <Label>{label}</Label>
      <Input
        value={formData[field]?.toString() || ""}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        secureTextEntry={options.secureTextEntry}
        keyboardType={options.keyboardType}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines}
        style={errors[field] ? styles.inputError : undefined}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Doctor Registration</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              {/* Personal Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    {renderInput("firstName", "First Name", "Enter your first name")}
                  </View>
                  <View style={styles.halfWidth}>
                    {renderInput("lastName", "Last Name", "Enter your last name")}
                  </View>
                </View>
                {renderInput("email", "Email", "Enter your email address", { keyboardType: "email-address" })}
                {renderInput("phone", "Phone Number", "Enter your phone number", { keyboardType: "phone-pad" })}
                {renderInput("civilId", "Civil ID", "Enter your Civil ID")}
              </View>

              {/* Security */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                {renderInput("password", "Password", "Enter your password", { secureTextEntry: true })}
                {renderInput("confirmPassword", "Confirm Password", "Confirm your password", { secureTextEntry: true })}
              </View>

              {/* Professional Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Information</Text>
                <Dropdown
                  value={formData.specialization}
                  onValueChange={(value: string) => handleInputChange("specialization", value)}
                  placeholder="Select your specialization"
                  data={specializations}
                  label="Specialization"
                  error={errors.specialization}
                />
                {renderInput("licenseNumber", "License Number", "Enter your medical license number")}
                <View style={styles.inputGroup}>
                  <Label>Years of Experience</Label>
                  <Input
                    value={formData.experience}
                    onChangeText={(value) => handleInputChange("experience", value)}
                    placeholder="Enter years of experience"
                    keyboardType="numeric"
                    style={errors.experience ? styles.inputError : undefined}
                  />
                  {errors.experience && (
                    <Text style={styles.errorText}>{errors.experience}</Text>
                  )}
                </View>
                {renderInput("education", "Education", "Enter your highest education degree")}
                {renderInput("hospital", "Hospital/Clinic (Optional)", "Enter hospital or clinic name")}
                {renderInput("address", "Address (Optional)", "Enter your address", { multiline: true, numberOfLines: 3 })}
              </View>

              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
                style={styles.submitButton}
                disabled={loading}
              />

              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={AppColors.primary} />
                  <Text style={styles.loadingText}>Creating your account...</Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.loginLink}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
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
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 0,
  },
  form: {
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  inputError: {
    borderColor: AppColors.error,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.error,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
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
  loginLink: {
    alignItems: "center",
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  loginLinkBold: {
    color: AppColors.primary,
    fontWeight: "600",
  },
}); 