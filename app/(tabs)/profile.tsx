import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
  education: string;
  bio: string;
  avatar: string;
  rating: number;
  totalPatients: number;
  totalAppointments: number;
}

// Mock data - will be replaced with backend data
const mockDoctorData: DoctorProfile = {
  id: "1",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  specialization: "Cardiology",
  licenseNumber: "MD123456",
  experience: "15 years",
  education: "Harvard Medical School",
  bio: "Experienced cardiologist with expertise in preventive cardiology and interventional procedures.",
  avatar: "person",
  rating: 4.8,
  totalPatients: 1250,
  totalAppointments: 3200,
};

export default function ProfileScreen() {
  const [doctorData, setDoctorData] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Simulate loading data from backend
  useEffect(() => {
    // TODO: Replace with actual backend API call
    setTimeout(() => {
      setDoctorData(mockDoctorData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: Implement logout logic (clear tokens, etc.)
          console.log("Logging out...");
          router.replace("/login");
        },
      },
    ]);
  };

  const renderProfileSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderInfoRow = (
    label: string,
    value: string | number,
    icon?: string
  ) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={16}
            color="#6b7280"
            style={styles.infoIcon}
          />
        )}
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Profile</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={24} color="#4DA8DA" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButtonSmall}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#4DA8DA" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Ionicons
                name={(doctorData?.avatar as any) || "person"}
                size={40}
                color="#ffffff"
              />
            </LinearGradient>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={styles.ratingText}>
                {doctorData?.rating || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>
              {doctorData?.name || "Loading..."}
            </Text>
            <Text style={styles.specialization}>
              {doctorData?.specialization || "Loading..."}
            </Text>
            <Text style={styles.licenseNumber}>
              License: {doctorData?.licenseNumber || "Loading..."}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {doctorData?.totalPatients || "0"}
            </Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {doctorData?.totalAppointments || "0"}
            </Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {doctorData?.experience || "N/A"}
            </Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>

        {/* Personal Information */}
        {renderProfileSection(
          "Personal Information",
          <View style={styles.sectionContent}>
            {renderInfoRow(
              "Email",
              doctorData?.email || "Loading...",
              "mail-outline"
            )}
            {renderInfoRow(
              "Phone",
              doctorData?.phone || "Loading...",
              "call-outline"
            )}
            {renderInfoRow(
              "Education",
              doctorData?.education || "Loading...",
              "school-outline"
            )}
          </View>
        )}

        {/* Professional Information */}
        {renderProfileSection(
          "Professional Information",
          <View style={styles.sectionContent}>
            {renderInfoRow(
              "Specialization",
              doctorData?.specialization || "Loading...",
              "medical-outline"
            )}
            {renderInfoRow(
              "License Number",
              doctorData?.licenseNumber || "Loading...",
              "card-outline"
            )}
            {renderInfoRow(
              "Experience",
              doctorData?.experience || "Loading...",
              "time-outline"
            )}
          </View>
        )}

        {/* Bio */}
        {renderProfileSection(
          "About",
          <View style={styles.sectionContent}>
            <Text style={styles.bioText}>
              {doctorData?.bio || "Loading..."}
            </Text>
          </View>
        )}

        {/* Settings */}
        {renderProfileSection(
          "Settings",
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#6b7280"
              />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons name="shield-outline" size={20} color="#6b7280" />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  editButton: {
    padding: 4,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutButtonSmall: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#f8fafc",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 40,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: "#4DA8DA",
    fontWeight: "600",
    marginBottom: 4,
  },
  licenseNumber: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#8DBCC7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "400",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#8DBCC7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  settingText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
});
