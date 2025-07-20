"use client";
import { apiService, Appointment } from "@/services/api";
import { authStorage, UserData } from "@/services/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Patient {
  id: string;
  name: string;
  time: string;
  type: string;
  avatar: string;
  status?: string;
}

export default function DoctorDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      console.log('🔄 Starting to load appointments...');
      const token = await authStorage.getAuthToken();
      if (token) {
        console.log('✅ Token found, proceeding with API calls');
        
        // Debug: Check user data and role
        const userData = await authStorage.getUserData();
        console.log('🔍 User data:', userData);
        console.log('🔍 User role:', userData?.role);
        console.log('🔍 User ID:', userData?._id);
        
        // First test basic connectivity
        console.log('🌐 Testing basic connectivity...');
        const connectivityResponse = await apiService.testBasicConnectivity();
        console.log('🌐 Connectivity result:', connectivityResponse);
        
        if (!connectivityResponse.success) {
          console.error('❌ Cannot reach server:', connectivityResponse.error);
          return;
        }
        
        // Then test server health
        console.log('🏥 Testing server health...');
        const healthResponse = await apiService.testServerHealth();
        console.log('🏥 Server health result:', healthResponse);
        
        // Then test appointments endpoints
        console.log('🧪 Testing appointments endpoints...');
        const testResponse = await apiService.testAppointmentsEndpoint();
        console.log('🧪 Endpoint test result:', testResponse);
        
        // Finally try to fetch appointments
        console.log('📋 Fetching appointments...');
        const appointmentsResponse = await apiService.getDoctorAppointments(token);
        console.log('📋 Appointments response:', appointmentsResponse);
        
        if (appointmentsResponse.success && appointmentsResponse.data) {
          console.log('✅ Appointments loaded successfully:', appointmentsResponse.data.length, 'appointments');
          console.log('📋 First appointment sample:', appointmentsResponse.data[0]);
          setAppointments(appointmentsResponse.data);
        } else {
          console.error('❌ Failed to load appointments:', appointmentsResponse.error);
        }
      } else {
        console.error('❌ No authentication token found');
      }
    } catch (error) {
      console.error('💥 Error loading appointments:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setLoading(true);
    await loadAppointments();
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await authStorage.getUserData();
        setUserData(data);
        
        if (data) {
          await loadAppointments();
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convert appointments to Patient format for display
  const todaysAppointments: Patient[] = appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      const isToday = appointmentDate.toDateString() === today.toDateString();
      return isToday && (apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status?.toLowerCase().includes('pending'));
    })
    .sort((a, b) => {
      // Handle time as string or number
      const timeA = typeof a.time === 'string' ? a.time : `${a.time}:00`;
      const timeB = typeof b.time === 'string' ? b.time : `${b.time}:00`;
      return new Date(`2000-01-01T${timeA}`).getTime() - new Date(`2000-01-01T${timeB}`).getTime();
    })
    .slice(0, 3)
    .map(apt => ({
      id: apt._id,
      name: apt.patient?.name ? `Patient: ${apt.patient.name}` : `${apt.type || 'Appointment'} - ${new Date(apt.date).toLocaleDateString()}`,
      time: `${typeof apt.time === 'string' ? apt.time : `${apt.time}:00`} - ${apt.type || 'Appointment'}`,
      type: apt.type || 'Appointment',
      avatar: "person",
    }));

  const upcomingAppointments: Patient[] = appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      const isFuture = appointmentDate > today;
      return isFuture && (apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status?.toLowerCase().includes('pending'));
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let timeDisplay = '';
      if (diffDays === 1) {
        timeDisplay = `Tomorrow at ${typeof apt.time === 'string' ? apt.time : `${apt.time}:00`}`;
      } else if (diffDays === 0) {
        timeDisplay = `Today at ${typeof apt.time === 'string' ? apt.time : `${apt.time}:00`}`;
      } else {
        timeDisplay = `${appointmentDate.toLocaleDateString()} at ${typeof apt.time === 'string' ? apt.time : `${apt.time}:00`}`;
      }
      
      return {
        id: apt._id,
        name: apt.patient?.name ? `Patient: ${apt.patient.name}` : `${apt.type || 'Appointment'} - ${appointmentDate.toLocaleDateString()}`,
        time: `${timeDisplay} - ${apt.type || 'Appointment'}`,
        type: apt.type || 'Appointment',
        avatar: "person",
      };
    });

  const patientQueue: Patient[] = appointments
    .filter(apt => apt.status?.toLowerCase().includes('waiting') || apt.status?.toLowerCase().includes('pending'))
    .slice(0, 2)
    .map(apt => {
      const appointmentDate = new Date(apt.date);
      const now = new Date();
      const diffTime = appointmentDate.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let timeDisplay = '';
      if (diffMinutes < 0) {
        // Appointment is in the past
        timeDisplay = 'Overdue';
      } else if (diffMinutes < 60) {
        // Less than 1 hour
        timeDisplay = `Due in ${diffMinutes} min`;
      } else if (diffHours < 24) {
        // Less than 1 day
        timeDisplay = `Due in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      } else {
        // More than 1 day
        timeDisplay = `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }
      
      return {
        id: apt._id,
        name: apt.patient?.name ? `Patient: ${apt.patient.name}` : `${apt.type || 'Appointment'} - ${new Date(apt.date).toLocaleDateString()}`,
        time: timeDisplay,
        type: apt.type || 'Appointment',
        avatar: "person",
        status: apt.status || 'pending',
      };
    });

  const quickActions = [
    { id: "1", title: "View Call", icon: "videocam-outline" },
    { id: "2", title: "Schedule", icon: "calendar-outline" },
  ];

  const renderPatientCard = (patient: Patient, showStatus = false) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.patientCard}
      activeOpacity={0.7}
      onPress={() => {
        // Find the original appointment data
        const originalAppointment = appointments.find(apt => apt._id === patient.id);
        if (originalAppointment) {
          // Navigate to patient details with appointment data
          router.push({
            pathname: "/modals/appointment-details",
            params: {
              appointment: JSON.stringify(originalAppointment)
            }
          });
        }
      }}
    >
      <View style={styles.patientInfo}>
        <LinearGradient
          colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Ionicons name={patient.avatar as any} size={20} color="#ffffff" />
        </LinearGradient>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientTime}>{patient.time}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  const renderQuickAction = (action: any) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      activeOpacity={0.7}
      onPress={() => {
        if (action.title === "View Call") {
          router.push("/modals/call-history");
        } else if (action.title === "Schedule") {
          router.push("/modals/all-appointments");
        }
      }}
    >
      <View style={styles.actionContent}>
        <Ionicons name={action.icon as any} size={20} color="#6b7280" />
        <Text style={styles.actionText}>{action.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <LinearGradient
            colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profilePic}
          >
            <Ionicons name="person" size={24} color="#ffffff" />
          </LinearGradient>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeBack}>Welcome Back</Text>
            <Text style={styles.doctorName}>
              {userData ? `Dr. ${userData.name}` : 'Loading...'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
              <Ionicons name="refresh-outline" size={20} color="#4DA8DA" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={20} color="#4DA8DA" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Banner - Fixed at top */}
      <TouchableOpacity 
        style={styles.searchBannerContainer}
        onPress={() => {
          console.log('🔍 Search banner tapped - navigating to search');
          router.push("/search-patients");
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#7BC8E8", "#6BB8D8", "#5BA8C8", "#4B98B8", "#5BA8C8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.searchBanner}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Looking for patients?</Text>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="#9ca3af" />
                <Text style={styles.searchPlaceholder}>
                  Search for patients...
                </Text>
              </View>
            </View>
            <View style={styles.bannerIcon}>
              <Ionicons name="medical" size={40} color="#ffffff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Appointments */}
        <View style={[styles.section, styles.firstSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity
              onPress={() => router.push("/modals/today-appointments")}
            >
              <Text style={styles.seeAllText}>See All {">"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {loading ? (
              <Text style={styles.emptyText}>Loading appointments...</Text>
            ) : todaysAppointments.length > 0 ? (
              todaysAppointments.map((patient) => renderPatientCard(patient))
            ) : (
              <Text style={styles.emptyText}>No appointments scheduled for today</Text>
            )}
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity
              onPress={() => router.push("/modals/all-appointments")}
            >
              <Text style={styles.seeAllText}>See All {">"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {loading ? (
              <Text style={styles.emptyText}>Loading upcoming appointments...</Text>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((patient) => renderPatientCard(patient))
            ) : (
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            )}
          </View>
        </View>

        {/* Patient Queue */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Queue</Text>
            <TouchableOpacity
              onPress={() => router.push("/modals/patient-queue")}
            >
              <Text style={styles.seeAllText}>See All {">"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {loading ? (
              <Text style={styles.emptyText}>Loading queue...</Text>
            ) : patientQueue.length > 0 ? (
              patientQueue.map((patient) => renderPatientCard(patient, true))
            ) : (
              <Text style={styles.emptyText}>No patients in queue</Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.sectionContent}>
            {quickActions.map((action) => renderQuickAction(action))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40, // Increased from 20 to create space from clock
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14, // Increased from 12 to 14
  },
  welcomeText: {
    flex: 1,
    justifyContent: "center", // Center the text vertically
    paddingVertical: 4, // Add some padding for better alignment
  },
  welcomeBack: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4, // Increased from 2 to 4
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 26, // Increased from 24 to 26
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBannerContainer: {
    position: "absolute",
    top: 120, // Reduced from 140 to bring it much closer to doctor name
    left: 20,
    right: 20,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  searchBanner: {
    borderRadius: 16,
    padding: 20,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: "#9ca3af",
    marginLeft: 8,
  },
  bannerIcon: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 140, // Reduced from 160 to match new banner position
  },
  section: {
    marginBottom: 32,
  },
  firstSection: {
    marginTop: 10, // Reduced from 20 to make it closer
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
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
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  patientTime: {
    fontSize: 13,
    color: "#6b7280",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    paddingVertical: 20,
  },
});
