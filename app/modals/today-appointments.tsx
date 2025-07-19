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
  time: string;
  type: string;
  avatar: string;
  status: "confirmed" | "pending" | "completed";
}

const todaysAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Patient: Ethan Carter",
    time: "9:00 AM - Check up",
    type: "Routine",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Patient: Olivia Bennett",
    time: "10:30 AM - Follow up",
    type: "Follow-up",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Patient: Noah Thompson",
    time: "1:00 PM - Lab Results",
    type: "Results",
    avatar: "person",
    status: "pending",
  },
  {
    id: "4",
    patientName: "Patient: Ava Harper",
    time: "2:30 PM - Consultation",
    type: "Consultation",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "5",
    patientName: "Patient: Liam Foster",
    time: "4:00 PM - Emergency",
    type: "Emergency",
    avatar: "person",
    status: "pending",
  },
  {
    id: "6",
    patientName: "Patient: Sophia Rodriguez",
    time: "5:30 PM - Check up",
    type: "Routine",
    avatar: "person",
    status: "confirmed",
  },
];

export default function TodayAppointmentsPage() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
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
        return styles.statusTextConfirmed;
      case "pending":
        return styles.statusTextPending;
      case "completed":
        return styles.statusTextCompleted;
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
            {todaysAppointments.map((appointment) =>
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
});
