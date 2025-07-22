"use client";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


type AppointmentDisplay = {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  avatar: string;
  meetingLink?: string;
};

export default function AllAppointmentsPage() {
  // Hardcoded upcoming appointments from July 26 to September 2025
  const appointments: AppointmentDisplay[] = [
    {
      id: 'u1',
      patientName: 'Omar Al-Khaled',
      date: 'Jul 26, 2025',
      time: '18:00',
      type: 'Consultation',
      status: 'confirmed',
      avatar: 'person',
    },
    {
      id: 'u2',
      patientName: 'Sara Al-Harbi',
      date: 'Jul 28, 2025',
      time: '19:30',
      type: 'Checkup',
      status: 'pending',
      avatar: 'person',
    },
    {
      id: 'u3',
      patientName: 'Yousef Al-Sabah',
      date: 'Aug 2, 2025',
      time: '21:00',
      type: 'Follow-up',
      status: 'pending',
      avatar: 'person',
    },
    {
      id: 'u4',
      patientName: 'Noura Al-Sabah',
      date: 'Aug 15, 2025',
      time: '10:00',
      type: 'Consultation',
      status: 'confirmed',
      avatar: 'person',
    },
    {
      id: 'u5',
      patientName: 'Mona Al-Ajmi',
      date: 'Sep 1, 2025',
      time: '13:30',
      type: 'Checkup',
      status: 'pending',
      avatar: 'person',
    },
    {
      id: 'u6',
      patientName: 'Salem Al-Mansour',
      date: 'Sep 15, 2025',
      time: '15:00',
      type: 'Follow-up',
      status: 'confirmed',
      avatar: 'person',
    },
  ];
  const loading = false;
  const error = null;

  const renderAppointmentCard = (appointment: AppointmentDisplay & { meetingLink?: string }) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentCard}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: "/modals/appointment-details", params: { id: appointment.id } })}
    >
      <View style={styles.appointmentInfo}>
        <LinearGradient
          colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Ionicons name="person" size={20} color="#ffffff" />
        </LinearGradient>
        <View style={styles.appointmentDetails}>
          <Text style={styles.patientName}>{appointment.patientName}</Text>
          <Text style={styles.appointmentType}>{appointment.type}</Text>
          <Text style={styles.appointmentDateTime}>
            {appointment.date} • {appointment.time}
          </Text>
        </View>
        {/* Meeting icon for all appointments */}
        {appointment.type?.toLowerCase() === 'online' && appointment.meetingLink ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(appointment.meetingLink!)}
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="videocam" size={22} color="#2A4D5F" />
          </TouchableOpacity>
        ) : (
          <View style={{ marginLeft: 12 }}>
            <Ionicons name="videocam" size={22} color="#b0b0b0" />
          </View>
        )}
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

  const sortedAppointments = appointments.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <View style={styles.header}>
          <View style={styles.titleRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#4DA8DA" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Upcoming Appointments</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.appointmentsList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading appointments...</Text>
              </View>
            ) : appointments.length > 0 ? (
              sortedAppointments.map((appointment) => renderAppointmentCard(appointment))
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
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  backButton: {
    padding: 4,
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: 'center',
    flex: 1,
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
  errorContainer: {
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 16,
    fontWeight: "500",
  },
});
