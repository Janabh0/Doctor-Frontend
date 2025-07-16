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

interface Patient {
  id: string;
  name: string;
  time: string;
  type: string;
  avatar: string;
  status?: string;
}

const todaysAppointments: Patient[] = [
  {
    id: "1",
    name: "Patient: Ethan Carter",
    time: "9:00 AM - Check up",
    type: "Routine",
    avatar: "person",
  },
  {
    id: "2",
    name: "Patient: Olivia Bennett",
    time: "10:30 AM - Follow up",
    type: "Follow-up",
    avatar: "person",
  },
  {
    id: "3",
    name: "Patient: Noah Thompson",
    time: "1:00 PM - Lab Results",
    type: "Results",
    avatar: "person",
  },
];

const patientQueue: Patient[] = [
  {
    id: "4",
    name: "Patient: Ava Harper",
    time: "Waiting for 10 min",
    type: "Walk-in",
    avatar: "person",
    status: "waiting",
  },
  {
    id: "5",
    name: "Patient: Liam Foster",
    time: "Due in 5 min",
    type: "Scheduled",
    avatar: "person",
    status: "upcoming",
  },
];

const quickActions = [
  { id: "1", title: "View Patient Records", icon: "document-text-outline" },
  { id: "2", title: "Secure Messaging", icon: "chatbubble-outline" },
  { id: "3", title: "View Call", icon: "videocam-outline" },
  { id: "4", title: "Schedule", icon: "calendar-outline" },
];

export default function DoctorDashboard() {
  const renderPatientCard = (patient: Patient, showStatus = false) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.patientCard}
      activeOpacity={0.7}
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
        <Text style={styles.dashboardTitle}>Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <View style={styles.sectionContent}>
            {todaysAppointments.map((patient) => renderPatientCard(patient))}
          </View>
        </View>

        {/* Patient Queue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Queue</Text>
          <View style={styles.sectionContent}>
            {patientQueue.map((patient) => renderPatientCard(patient, true))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
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
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
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
  avatarText: {
    fontSize: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
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
});
