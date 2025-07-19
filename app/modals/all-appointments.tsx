"use client";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Stack } from "expo-router";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  avatar: string;
}

const allAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    date: "Today",
    time: "9:00 AM",
    type: "Check-up",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    date: "Today",
    time: "10:30 AM",
    type: "Follow-up",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "3",
    patientName: "Emily Davis",
    date: "Today",
    time: "1:00 PM",
    type: "Lab Results",
    status: "pending",
    avatar: "person",
  },
  {
    id: "4",
    patientName: "David Wilson",
    date: "Tomorrow",
    time: "11:00 AM",
    type: "Consultation",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "5",
    patientName: "Lisa Brown",
    date: "Tomorrow",
    time: "2:30 PM",
    type: "Emergency",
    status: "pending",
    avatar: "person",
  },
  {
    id: "6",
    patientName: "Robert Taylor",
    date: "Dec 21",
    time: "9:15 AM",
    type: "Routine",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "7",
    patientName: "Jennifer Lee",
    date: "Dec 21",
    time: "3:45 PM",
    type: "Follow-up",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "8",
    patientName: "Thomas Anderson",
    date: "Dec 22",
    time: "10:00 AM",
    type: "Consultation",
    status: "pending",
    avatar: "person",
  },
  {
    id: "9",
    patientName: "Maria Garcia",
    date: "Dec 22",
    time: "1:30 PM",
    type: "Check-up",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "10",
    patientName: "James Wilson",
    date: "Dec 23",
    time: "11:45 AM",
    type: "Emergency",
    status: "pending",
    avatar: "person",
  },
  {
    id: "11",
    patientName: "Amanda Clark",
    date: "Dec 23",
    time: "4:00 PM",
    type: "Lab Results",
    status: "confirmed",
    avatar: "person",
  },
  {
    id: "12",
    patientName: "Daniel Martinez",
    date: "Dec 24",
    time: "9:30 AM",
    type: "Routine",
    status: "confirmed",
    avatar: "person",
  },
];

export default function AllAppointmentsPage() {
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

  const renderAppointmentCard = (appointment: Appointment) => (
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

  const confirmedAppointments = allAppointments.filter(
    (a) => a.status === "confirmed"
  );
  const pendingAppointments = allAppointments.filter(
    (a) => a.status === "pending"
  );
  const completedAppointments = allAppointments.filter(
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
            <Text style={styles.statNumber}>{allAppointments.length}</Text>
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
            {allAppointments.map((appointment) =>
              renderAppointmentCard(appointment)
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
});
