"use client";
import { apiService } from "@/services/api";
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
  date: string;
  time: string;
  type: string;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "scheduled" | "waiting";
  avatar: string;
}

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const token = await authStorage.getAuthToken();
      if (token) {
        const response = await apiService.getDoctorAppointments(token);
        if (response.success && response.data) {
          // Convert backend appointments to display format
          const displayAppointments: AppointmentDisplay[] = response.data
            .filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'pending')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(apt => {
              const appointmentDate = new Date(apt.date);
              const today = new Date();
              const diffTime = appointmentDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              let dateDisplay = '';
              if (diffDays === 1) {
                dateDisplay = 'Tomorrow';
              } else if (diffDays === 0) {
                dateDisplay = 'Today';
              } else if (diffDays < 0) {
                dateDisplay = appointmentDate.toLocaleDateString();
              } else {
                dateDisplay = appointmentDate.toLocaleDateString();
              }
              
              return {
                id: apt._id,
                patientName: apt.patient?.name ? apt.patient.name : `Appointment ${apt._id.slice(-4)}`,
                date: dateDisplay,
                time: typeof apt.time === 'string' ? apt.time : `${apt.time}:00`,
                type: apt.type || 'Appointment',
                status: apt.status as any,
                avatar: "person",
              };
            });
          
          setAppointments(displayAppointments);
        }
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusConfirmed;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.statusTextConfirmed;
      case "pending":
        return styles.statusTextPending;
      case "completed":
        return styles.statusTextCompleted;
      case "cancelled":
        return styles.statusTextCancelled;
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
            name="person"
            size={20}
            color="#ffffff"
          />
        </LinearGradient>
        <View style={styles.appointmentDetails}>
          <Text style={styles.patientName}>{appointment.patientName}</Text>
          <Text style={styles.appointmentType}>{appointment.type}</Text>
          <Text style={styles.appointmentDateTime}>
            {appointment.date} • {appointment.time}
          </Text>
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

  const confirmedAppointments = appointments.filter(
    (a) => a.status === "confirmed"
  );
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
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
            <Text style={styles.pageTitle}>All Appointments</Text>
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
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {confirmedAppointments.length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingAppointments.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {completedAppointments.length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Appointments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.appointmentsList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading appointments...</Text>
              </View>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) =>
                renderAppointmentCard(appointment)
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No appointments found</Text>
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
    paddingTop: 16,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 6,
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
  appointmentDateTime: {
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
  statusCancelled: {
    backgroundColor: "#fee2e2",
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
  statusTextCancelled: {
    color: "#dc2626",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
});
