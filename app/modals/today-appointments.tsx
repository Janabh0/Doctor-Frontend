"use client";
import { apiService, Appointment } from "@/services/api";
import { authStorage } from "@/services/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
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

interface AppointmentDisplay {
  id: string;
  patientName: string;
  time: string;
  type: string;
  avatar: string;
  status: "confirmed" | "pending" | "completed" | "scheduled" | "waiting";
}

export default function TodayAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        console.log('🔄 Loading today\'s appointments...');
        const token = await authStorage.getAuthToken();
        console.log('🔑 Token exists:', !!token);
        console.log('🔑 Token length:', token?.length || 0);
        
        if (token) {
          const response = await apiService.getDoctorAppointments(token);
          console.log('📋 Appointments response:', response);
          
          if (response.success && response.data) {
            console.log('✅ Appointments loaded:', response.data.length, 'appointments');
            console.log('📅 Sample appointment:', response.data[0]);
            console.log('📅 All appointments data:', JSON.stringify(response.data, null, 2));
            setAppointments(response.data);
          } else {
            console.error('❌ Failed to load appointments:', response.error);
            console.error('❌ Full response:', response);
          }
        } else {
          console.error('❌ No authentication token found');
          console.error('❌ Please make sure you are logged in');
        }
      } catch (error) {
        console.error('💥 Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Convert backend appointments to display format - filter for today only
  const todaysAppointments: AppointmentDisplay[] = appointments
    .filter(apt => {
      try {
        const appointmentDate = new Date(apt.date);
        const today = new Date();
        
        // Reset time to compare only dates
        const aptDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const isToday = aptDateOnly.getTime() === todayOnly.getTime();
        
        console.log(`📅 Appointment date: ${apt.date} -> ${aptDateOnly.toDateString()}`);
        console.log(`📅 Today: ${todayOnly.toDateString()}`);
        console.log(`📅 Is today: ${isToday}`);
        
        return isToday;
      } catch (error) {
        console.error('❌ Error parsing appointment date:', apt.date, error);
        return false;
      }
    })
    .sort((a, b) => {
      // Handle time as string or number
      const timeA = typeof a.time === 'string' ? a.time : `${a.time}:00`;
      const timeB = typeof b.time === 'string' ? b.time : `${b.time}:00`;
      return new Date(`2000-01-01T${timeA}`).getTime() - new Date(`2000-01-01T${timeB}`).getTime();
    })
    .map(apt => ({
      id: apt._id,
      patientName: `Patient: ${apt.patient?.name || 'Unknown'}`,
      time: `${typeof apt.time === 'string' ? apt.time : `${apt.time}:00`} - ${apt.type}`,
      type: apt.type,
      avatar: "person",
      status: apt.status as any,
    }));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return styles.statusConfirmed;
      case "pending":
      case "waiting":
        return styles.statusPending;
      case "completed":
        return styles.statusCompleted;
      default:
        return styles.statusConfirmed;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return styles.statusTextConfirmed;
      case "pending":
      case "waiting":
        return styles.statusTextPending;
      case "completed":
        return styles.statusTextCompleted;
      default:
        return styles.statusTextConfirmed;
    }
  };

  const renderAppointmentCard = (appointment: AppointmentDisplay) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentCard}
      activeOpacity={0.7}
    >
      <View style={styles.appointmentInfo}>
        <LinearGradient
          colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Ionicons
            name={appointment.avatar as any}
            size={20}
            color="#ffffff"
          />
        </LinearGradient>
        <View style={styles.appointmentDetails}>
          <Text style={styles.patientName}>{appointment.patientName}</Text>
          <Text style={styles.appointmentType}>{appointment.type}</Text>
          <Text style={styles.appointmentTime}>{appointment.time}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
        <Text
          style={[styles.statusText, getStatusTextStyle(appointment.status)]}
        >
          {appointment.status.charAt(0).toUpperCase() +
            appointment.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#4DA8DA" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Today's Appointments</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications" size={20} color="#4DA8DA" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{todaysAppointments.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {
                todaysAppointments.filter((a) => a.status === "confirmed")
                  .length
              }
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {todaysAppointments.filter((a) => a.status === "pending").length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Appointments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.appointmentsList}>
            {loading ? (
              <Text style={styles.emptyText}>Loading appointments...</Text>
            ) : todaysAppointments.length > 0 ? (
              todaysAppointments.map((appointment) =>
                renderAppointmentCard(appointment)
              )
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No appointments found for today</Text>
                <Text style={styles.debugText}>Total appointments loaded: {appointments.length}</Text>
                <Text style={styles.debugText}>Today's date: {new Date().toDateString()}</Text>
                {appointments.length > 0 && (
                  <Text style={styles.debugText}>Sample appointment date: {appointments[0]?.date}</Text>
                )}
                <Text style={styles.debugText}>Please check if you are logged in</Text>
                <Text style={styles.debugText}>Check console for detailed logs</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40, // Increased from 16 to create space from clock
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 24,
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
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
  },
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  appointmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusCompleted: {
    backgroundColor: "#e0e7ff",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextConfirmed: {
    color: "#16a34a",
  },
  statusTextPending: {
    color: "#d97706",
  },
  statusTextCompleted: {
    color: "#4f46e5",
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  debugText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
});
