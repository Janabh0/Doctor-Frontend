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
  { id: "1", title: "View Call", icon: "videocam-outline" },
  { id: "2", title: "Schedule", icon: "calendar-outline" },
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
            <Text style={styles.doctorName}>Dr. Williamson</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={20} color="#4DA8DA" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Banner - Fixed at top */}
      <View style={styles.searchBannerContainer}>
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity
              onPress={() => router.push("/modals/today-appointments")}
            >
              <Text style={styles.seeAllText}>See All {">"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {todaysAppointments.map((patient) => renderPatientCard(patient))}
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
            {patientQueue.map((patient) => renderPatientCard(patient, true))}
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
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeBack: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
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
    top: 160,
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
    paddingTop: 160,
  },
  section: {
    marginBottom: 32,
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
});
