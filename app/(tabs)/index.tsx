"use client";
import { allAppointments } from "@/API/doctorAppointments";
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
  View
} from "react-native";

interface Patient {
  id: string;
  name: string;
  time: string;
  type: string;
  avatar: string;
  status?: string;
}

// Add AppointmentDisplay interface
interface AppointmentDisplay {
  id: string;
  patientName: string;
  time: string;
  type: string;
  avatar: string;
  status: string;
}

export default function DoctorDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  // Remove useQuery and use only the hardcoded allAppointments array
  const isLoading = false;
  const error = null;
  const refetch = () => {};

  // State for filter
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState<'online' | 'offline' | null>(null);
  const filteredAppointments = appointmentTypeFilter
    ? allAppointments.filter((apt: Appointment) => apt.type?.toLowerCase() === appointmentTypeFilter)
    : [];

  // Function to fetch all appointments and filter by type
  const fetchAndFilterAppointments = async (type: 'online' | 'offline') => {
    setAppointmentTypeFilter(type);
    // setFetchingAppointments(true); // Removed
    try {
      const token = await authStorage.getAuthToken();
      if (!token) throw new Error("Authentication token is missing.");
      const response = await apiService.getDoctorAppointments(token);
      if (!response.success || !response.data) throw new Error(response.error);
      // setFilteredAppointments(response.data.filter((apt: any) => apt.type?.toLowerCase() === type)); // Removed
    } catch (err) {
      // setFilteredAppointments([]); // Removed
    } finally {
      // setFetchingAppointments(false); // Removed
    }
  };
  

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
        
        // Finally try to fetch appointments
        console.log('📋 Fetching appointments...');
        const appointmentsResponse = await apiService.getDoctorAppointments(token);
        console.log('📋 Appointments response:', appointmentsResponse);
        
        if (appointmentsResponse.success && appointmentsResponse.data) {
          console.log('✅ Appointments loaded successfully:', appointmentsResponse.data.length, 'appointments');
          console.log('📋 First appointment sample:', appointmentsResponse.data[0]);
          // setAppointments(appointmentsResponse.data); // This line is now handled by useQuery
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
    // setLoading(true); // This line is now handled by useQuery
    await refetch();
    // setLoading(false); // This line is now handled by useQuery
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
        // setLoading(false); // This line is now handled by useQuery
      }
    };

    loadData();
  }, []);

  // Strict date matching for appointments
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isToday = (aptDate: Date | string) => {
    const date = new Date(aptDate);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  // Update references to 'appointments' to 'allAppointments' and add type annotations
  const todaysAppointments: Appointment[] = [
    {
      _id: '1',
      patient: { _id: 'p1', name: 'Ahmad Al-Farsi', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: new Date().toISOString(),
      time: '21:00', // 9:00 pm
      type: 'Checkup',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      patient: { _id: 'p2', name: 'Fatima Al-Sabah', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: new Date().toISOString(),
      time: '21:45', // 9:45 pm
      type: 'Consultation',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      patient: { _id: 'p3', name: 'Layla Al-Mutairi', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: new Date().toISOString(),
      time: '22:30', // 10:30 pm
      type: 'Follow-up',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Count pending and confirmed for today
  const totalToday = todaysAppointments.length;
  const confirmedToday = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "confirmed").length;
  const pendingToday = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "pending").length;

  // Map todaysAppointments to AppointmentDisplay
  const todaysAppointmentsDisplay: AppointmentDisplay[] = todaysAppointments.map(apt => ({
    id: apt._id,
    patientName: apt.patient?.name || "Unknown",
    time: `${typeof apt.time === "string" ? apt.time : `${apt.time}:00`} - ${apt.type}`,
    type: apt.type,
    avatar: "person",
    status: (apt.status?.toLowerCase() || "pending") as AppointmentDisplay["status"],
  }));

  const renderPatientCard = (patient: Patient & { date?: string; timeOnly?: string }, showStatus = false) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.patientCard}
      activeOpacity={0.7}
      onPress={() => {
        // Find the original appointment data
        const originalAppointment = allAppointments.find(apt => apt._id === patient.id);
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
          <Text style={styles.patientName}>{patient.name || "Unknown Patient"}</Text>
          <Text style={styles.patientTime}>{patient.date}</Text>
          <Text style={styles.patientTime}>{patient.timeOnly}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  // Update mapping for all sections to include only name, date, and time
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const formatTime = (time: string | number) => {
    if (typeof time === 'string') return time;
    if (typeof time === 'number') return `${time}:00`;
    return '';
  };

  // Hardcode the upcomingAppointments array for preview
  const upcomingAppointments: Patient[] = [
    {
      id: 'u1',
      name: 'Omar Al-Khaled',
      time: '18:00', // 6:00 pm
      type: 'Consultation',
      avatar: 'person',
      status: 'confirmed',
    },
    {
      id: 'u2',
      name: 'Sara Al-Harbi',
      time: '19:30', // 7:30 pm
      type: 'Checkup',
      avatar: 'person',
      status: 'pending',
    },
    {
      id: 'u3',
      name: 'Yousef Al-Sabah',
      time: '21:00', // 9:00 pm
      type: 'Follow-up',
      avatar: 'person',
      status: 'pending',
    },
  ];

  const pastAppointments: Patient[] = allAppointments
    .filter((apt: Appointment) => {
      const aptDate = new Date(apt.date);
      const aptDay = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
      return aptDay.getTime() < today.getTime();
    })
    .sort((a: Appointment, b: Appointment) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
    .slice(0, 3)
    .map((apt: Appointment) => {
      const formattedTime = formatTime(apt.time);
      return {
        id: apt._id,
        name: apt.patient?.name || `${apt.type || 'Appointment'}`,
        date: formatDate(apt.date),
        timeOnly: formattedTime,
        time: formattedTime, // Required for Patient type
        type: apt.type || 'Appointment',
        avatar: "person",
      };
    });

  const patientQueue: Patient[] = allAppointments
    .filter((apt: Appointment) => apt.status?.toLowerCase().includes('waiting') || apt.status?.toLowerCase().includes('pending'))
    .slice(0, 2)
    .map((apt: Appointment) => {
      const formattedTime = formatTime(apt.time);
      return {
        id: apt._id,
        name: apt.patient?.name || `${apt.type || 'Appointment'}`,
        date: formatDate(apt.date),
        timeOnly: formattedTime,
        time: formattedTime, // Required for Patient type
        type: apt.type || 'Appointment',
        avatar: "person",
        status: apt.status || 'pending',
      };
    });

  const quickActions = [
    { id: "1", title: "View Call", icon: "videocam-outline" },
  ];

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

  // Add a renderAppointmentCard function for AppointmentDisplay
  const renderAppointmentCard = (appointment: AppointmentDisplay) => (
    <View key={appointment.id} style={styles.patientCardContainer}>
      <View style={styles.patientCard}>
        <View style={styles.patientInfo}>
          <LinearGradient
            colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
            style={styles.avatar}
          >
            <Ionicons name="person" size={24} color="#ffffff" />
          </LinearGradient>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{appointment.patientName}</Text>
            <Text style={styles.patientTime}>{appointment.time}</Text>
          </View>
        </View>
      </View>
    </View>
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
              {userData ? `Dr. ${userData.name || ''}` : 'Loading...'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
              <Ionicons name="refresh-outline" size={20} color="#4DA8DA" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Banner - Now scrolls with content */}
      <TouchableOpacity 
        style={styles.searchBannerContainer}
        onPress={() => {
          console.log('🔍 Search banner tapped - navigating to search');
          router.push("/search-patients");
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#2A4D5F", "#3A6B8A", "#5CA9D6"]}
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

      <ScrollView style={[styles.content, { backgroundColor: '#fff' }]} showsVerticalScrollIndicator={false}>
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
            {isLoading ? (
              <Text style={styles.emptyText}>Loading appointments...</Text>
            ) : todaysAppointmentsDisplay.length > 0 ? (
              todaysAppointmentsDisplay.map(appointment =>
                renderAppointmentCard(appointment)
              )
            ) : (
              <Text style={styles.emptyText}>No appointments scheduled for today</Text>
            )}
          </View>
        </View>

        {/* All Appointments Box (replaces Upcoming Appointments) */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#8DBCC7',
          marginBottom: 24,
          marginHorizontal: 0,
          padding: 16,
        }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12, textAlign: 'center' }}>All Appointments</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: appointmentTypeFilter === 'online' ? '#2A4D5F' : '#e6f3ff',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginRight: 8,
              }}
              onPress={() => setAppointmentTypeFilter('online')}
            >
              <Text style={{ color: appointmentTypeFilter === 'online' ? '#fff' : '#2A4D5F', fontWeight: '600', fontSize: 16 }}>Online</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: appointmentTypeFilter === 'offline' ? '#2A4D5F' : '#e6f3ff',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 24,
                marginLeft: 8,
              }}
              onPress={() => setAppointmentTypeFilter('offline')}
            >
              <Text style={{ color: appointmentTypeFilter === 'offline' ? '#fff' : '#2A4D5F', fontWeight: '600', fontSize: 16 }}>Offline</Text>
            </TouchableOpacity>
          </View>
          {/* Show filtered appointments if a filter is selected */}
          {appointmentTypeFilter && (
            <ScrollView style={{ maxHeight: 220, marginTop: 16 }}>
              {isLoading ? (
                <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>Loading appointments...</Text>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <View key={apt._id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#D1E9F6',
                    padding: 12,
                    marginBottom: 10,
                  }}>
                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#111827' }}>{apt.patient?.name || 'Unknown'}</Text>
                    <Text style={{ color: '#6b7280', fontSize: 14 }}>{apt.type}</Text>
                    <Text style={{ color: '#4DA8DA', fontSize: 13 }}>{typeof apt.time === 'string' ? apt.time : `${apt.time}:00`} - {apt.date}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#6b7280', textAlign: 'center', marginTop: 12 }}>No appointments found</Text>
              )}
            </ScrollView>
          )}
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
            {isLoading ? (
              <Text style={styles.emptyText}>Loading upcoming appointments...</Text>
            ) : upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((patient) => renderPatientCard(patient))
            ) : (
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            )}
          </View>
        </View>

        {/* Past Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Past Appointments</Text>
          </View>
          <View style={styles.sectionContent}>
            {isLoading ? (
              <Text style={styles.emptyText}>Loading past appointments...</Text>
            ) : pastAppointments.length > 0 ? (
              pastAppointments.map((patient) => renderPatientCard(patient))
            ) : (
              <Text style={styles.emptyText}>No past appointments</Text>
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
            {isLoading ? (
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
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16, // Match the appointments page
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
    justifyContent: "center",
    alignItems: "center",
  },
  searchBannerContainer: {
    position: "absolute",
    top: 170, // Adjusted to bring the blue box to a comfortable distance from the welcome name
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
  patientCardContainer: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 0,
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
    paddingVertical: 20,
  },
});
