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

interface Patient {
  id: string;
  name: string;
  age: string;
  condition: string;
  waitTime: string;
  priority: "high" | "medium" | "low";
  avatar: string;
}

export default function PatientQueuePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
          setAppointments(response.data);
        }
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert appointments to patient queue format
  const patientQueue: Patient[] = appointments
    .filter(apt => apt.status === 'waiting' || apt.status === 'pending')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((apt, index) => {
      // Calculate wait time based on appointment date vs current time
      const appointmentDate = new Date(apt.date);
      const now = new Date();
      const diffTime = appointmentDate.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let waitTime = '';
      if (diffMinutes < 0) {
        // Appointment is in the past
        waitTime = 'Overdue';
      } else if (diffMinutes < 60) {
        // Less than 1 hour
        waitTime = `${diffMinutes} min`;
      } else if (diffHours < 24) {
        // Less than 1 day
        waitTime = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      } else {
        // More than 1 day
        waitTime = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
      }
      
      // Determine priority based on appointment type and time until appointment
      let priority: "high" | "medium" | "low" = "medium";
      if (apt.type.toLowerCase().includes('emergency') || diffMinutes < 30) {
        priority = "high";
      } else if (apt.type.toLowerCase().includes('routine') || diffDays > 7) {
        priority = "low";
      }
      
      return {
        id: apt._id,
        name: apt.patient?.name || 'Unknown Patient',
        age: "Unknown", // Backend doesn't provide age
        condition: apt.type,
        waitTime,
        priority,
        avatar: "person",
      };
    });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const getPriorityTextStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityTextHigh;
      case "medium":
        return styles.priorityTextMedium;
      case "low":
        return styles.priorityTextLow;
      default:
        return styles.priorityTextMedium;
    }
  };

  const renderPatientCard = (patient: Patient) => (
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
          <Text style={styles.patientAge}>{patient.age}</Text>
          <Text style={styles.patientCondition}>{patient.condition}</Text>
        </View>
      </View>
      <View style={styles.queueInfo}>
        <View
          style={[styles.priorityBadge, getPriorityStyle(patient.priority)]}
        >
          <Text
            style={[
              styles.priorityText,
              getPriorityTextStyle(patient.priority),
            ]}
          >
            {patient.priority.charAt(0).toUpperCase() +
              patient.priority.slice(1)}
          </Text>
        </View>
        <Text style={styles.waitTime}>Wait: {patient.waitTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const highPriorityPatients = patientQueue.filter(
    (p) => p.priority === "high"
  );
  const mediumPriorityPatients = patientQueue.filter(
    (p) => p.priority === "medium"
  );
  const lowPriorityPatients = patientQueue.filter((p) => p.priority === "low");

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
            <Text style={styles.pageTitle}>Patient Queue</Text>
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
            <Text style={styles.statNumber}>{patientQueue.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{highPriorityPatients.length}</Text>
            <Text style={styles.statLabel}>High Priority</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mediumPriorityPatients.length}
            </Text>
            <Text style={styles.statLabel}>Medium</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{lowPriorityPatients.length}</Text>
            <Text style={styles.statLabel}>Low</Text>
          </View>
        </View>

        {/* Patient Queue List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.queueList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading patient queue...</Text>
              </View>
            ) : patientQueue.length > 0 ? (
              patientQueue.map((patient) => renderPatientCard(patient))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No patients in queue</Text>
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
  queueList: {
    paddingHorizontal: 20,
  },
  patientCard: {
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
  patientInfo: {
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
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  patientCondition: {
    fontSize: 14,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  queueInfo: {
    alignItems: "flex-end",
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  priorityHigh: {
    backgroundColor: "#fee2e2",
  },
  priorityMedium: {
    backgroundColor: "#fef3c7",
  },
  priorityLow: {
    backgroundColor: "#dcfce7",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  priorityTextHigh: {
    color: "#dc2626",
  },
  priorityTextMedium: {
    color: "#d97706",
  },
  priorityTextLow: {
    color: "#16a34a",
  },
  waitTime: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
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
