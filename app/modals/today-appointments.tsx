"use client";
import { Appointment } from "@/services/api";
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
  // Hardcode the appointments array with Arabian names for testing
  const appointments: Appointment[] = [
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
  const loading = false;

  // Filter for today's appointments using robust date logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (aptDate: Date | string) => {
    const date = new Date(aptDate);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const todaysAppointments = appointments.filter(apt => isToday(apt.date));
  const total = todaysAppointments.length;
  const confirmed = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "confirmed").length;
  const pending = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "pending").length;

  // Map todaysAppointments to AppointmentDisplay[]
  const todaysAppointmentsDisplay: AppointmentDisplay[] = todaysAppointments.map(apt => ({
    id: apt._id,
    patientName: apt.patient?.name || "Unknown",
    time: `${typeof apt.time === "string" ? apt.time : `${apt.time}:00`} - ${apt.type}`,
    type: apt.type,
    avatar: "person",
    status: (apt.status?.toLowerCase() || "pending") as AppointmentDisplay["status"],
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

  const renderAppointmentCard = (appointment: AppointmentDisplay & { meetingLink?: string }) => (
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
        {/* Meeting icon box */}
        {appointment.type?.toLowerCase() === 'online' && appointment.meetingLink ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(appointment.meetingLink!)}
            style={{ marginLeft: 12 }}
          >
            <Ionicons name="videocam" size={22} color="#2A4D5F" />
          </TouchableOpacity>
        ) : null}
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
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{confirmed}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Appointments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.appointmentsList}>
            {loading ? (
              <Text style={styles.emptyText}>Loading appointments...</Text>
            ) : todaysAppointmentsDisplay.length > 0 ? (
              todaysAppointmentsDisplay.map(appointment =>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 1.5,
    backgroundColor: "#111",
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
  patientCardContainer: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1E9F6', // subtle light blue
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientDetails: {
    marginLeft: 12,
  },
});
