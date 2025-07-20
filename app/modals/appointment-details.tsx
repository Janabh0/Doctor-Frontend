"use client";
import { Appointment } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface AppointmentDetails {
  id: string;
  patientName: string;
  patientGender?: string;
  patientAge?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  appointmentStatus: string;
  appointmentDuration?: number;
  appointmentNotes?: string[];
  doctorName?: string;
  doctorSpecialty?: string;
}

export default function AppointmentDetailsPage() {
  const params = useLocalSearchParams();
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.appointment) {
      try {
        const appointment = JSON.parse(params.appointment as string) as Appointment;
        loadAppointmentDetails(appointment);
      } catch (error) {
        console.error('Error parsing appointment data:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [params.appointment]);

  const loadAppointmentDetails = useCallback((appointment: Appointment) => {
    try {
      setLoading(true);
      
      // Create appointment details from the appointment data
      const appointmentDetails: AppointmentDetails = {
        id: appointment._id,
        patientName: appointment.patient?.name || 'Unknown Patient',
        patientGender: 'Not available', // You can update this when backend provides gender
        patientAge: 'Not available', // You can update this when backend provides age
        appointmentDate: new Date(appointment.date).toLocaleDateString(),
        appointmentTime: typeof appointment.time === 'string' ? appointment.time : `${appointment.time}:00`,
        appointmentType: appointment.type || 'Appointment',
        appointmentStatus: appointment.status || 'Pending',
        appointmentDuration: appointment.duration,
        appointmentNotes: appointment.notes,
        doctorName: appointment.doctor?.name,
        doctorSpecialty: appointment.doctor?.speciality,
      };

      setAppointmentDetails(appointmentDetails);
    } catch (error) {
      console.error('Error loading appointment details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.statusConfirmed;
      case "pending":
        return styles.statusPending;
      case "completed":
        return styles.statusCompleted;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.statusTextConfirmed;
      case "pending":
        return styles.statusTextPending;
      case "completed":
        return styles.statusTextCompleted;
      case "cancelled":
        return styles.statusTextCancelled;
      default:
        return styles.statusTextPending;
    }
  };

  const renderInfoRow = (label: string, value: string | number | undefined, icon?: string) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={16}
            color="#6b7280"
            style={styles.infoIcon}
          />
        )}
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || 'Not available'}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading appointment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.pageTitle}>Appointment Details</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="call-outline" size={20} color="#4DA8DA" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Appointment Header */}
          <View style={styles.appointmentHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}
              >
                <Ionicons name="calendar" size={40} color="#ffffff" />
              </LinearGradient>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentTitle}>{appointmentDetails?.appointmentType}</Text>
              <Text style={styles.appointmentId}>ID: {appointmentDetails?.id}</Text>
            </View>
          </View>

          {/* Appointment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Summary</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentCardHeader}>
                <Text style={styles.appointmentType}>{appointmentDetails?.appointmentType}</Text>
                <View style={[styles.statusBadge, getStatusStyle(appointmentDetails?.appointmentStatus || '')]}>
                  <Text style={[styles.statusText, getStatusTextStyle(appointmentDetails?.appointmentStatus || '')]}>
                    {appointmentDetails?.appointmentStatus}
                  </Text>
                </View>
              </View>
              <View style={styles.appointmentDetails}>
                {renderInfoRow("Date", appointmentDetails?.appointmentDate, "calendar-outline")}
                {renderInfoRow("Time", appointmentDetails?.appointmentTime, "time-outline")}
                {appointmentDetails?.appointmentDuration && renderInfoRow("Duration", `${appointmentDetails.appointmentDuration} minutes`, "timer-outline")}
              </View>
            </View>
          </View>

          {/* Patient Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.sectionContent}>
              {renderInfoRow("Name", appointmentDetails?.patientName, "person-outline")}
              {renderInfoRow("Gender", appointmentDetails?.patientGender, "male-female-outline")}
              {renderInfoRow("Age", appointmentDetails?.patientAge, "person-outline")}
            </View>
          </View>

          {/* Doctor Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor Information</Text>
            <View style={styles.sectionContent}>
              {renderInfoRow("Name", appointmentDetails?.doctorName, "person-outline")}
              {renderInfoRow("Specialty", appointmentDetails?.doctorSpecialty, "medical-outline")}
            </View>
          </View>

          {/* Notes */}
          {appointmentDetails?.appointmentNotes && appointmentDetails.appointmentNotes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.sectionContent}>
                {appointmentDetails.appointmentNotes.map((note, index) => (
                  <View key={index} style={styles.noteItem}>
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
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
    paddingTop: 50, // Increased from 20 to create space from clock
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  appointmentId: {
    fontSize: 14,
    color: "#6b7280",
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
  appointmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusCompleted: {
    backgroundColor: "#dbeafe",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextConfirmed: {
    color: "#166534",
  },
  statusTextPending: {
    color: "#92400e",
  },
  statusTextCompleted: {
    color: "#1e40af",
  },
  statusTextCancelled: {
    color: "#991b1b",
  },
  appointmentDetails: {
    gap: 12,
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabelText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  noteItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  noteText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
}); 