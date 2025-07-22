"use client";

import { Appointment, getDoctorAppointments } from "@/API/doctorAppointments";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define Patient type based on Appointment.patient
type Patient = NonNullable<Appointment["patient"]>;

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  // Remove genderFilter state
  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["doctorAppointments"],
    queryFn: async () => {
      const response = await getDoctorAppointments();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch doctor appointments");
      }
      return response.data;
    },
  });

  // Hardcode the patients array with Arabian names
  const uniquePatients: Patient[] = [
    { _id: 'p1', name: 'Ahmad Al-Farsi', gender: 'male' },
    { _id: 'p2', name: 'Fatima Al-Sabah', gender: 'female' },
    { _id: 'p3', name: 'Layla Al-Mutairi', gender: 'female' },
    { _id: 'p4', name: 'Yousef Al-Sabah', gender: 'male' },
    { _id: 'p5', name: 'Mona Al-Ajmi', gender: 'female' },
    { _id: 'p6', name: 'Salem Al-Mansour', gender: 'male' },
  ];

  // Remove gender filtering from filteredPatients
  const filteredPatients = uniquePatients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderPatientCard = (patient: Patient) => (
    <TouchableOpacity
      key={patient._id}
      style={styles.patientCard}
      activeOpacity={0.7}
      onPress={() => {
        router.push({
          pathname: "/modals/patient-details",
          params: { patientId: patient._id },
        });
      }}
    >
      <View style={styles.patientInfo}>
        <LinearGradient
          colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
          style={styles.avatar}
        >
          <Ionicons name="person" size={24} color="#fff" />
        </LinearGradient>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patient.name}</Text>
          {(patient.gender || patient.phoneNum) && (
            <Text style={styles.patientTime}>
              {patient.gender ?? ""}
              {patient.gender && patient.phoneNum ? ", " : ""}
              {patient.phoneNum ?? ""}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Loading patients…</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>
          Failed to load patients: {(error as Error).message}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Patients</Text>
          {/* Optional: Add a refresh button for consistency */}
          {/* <TouchableOpacity onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={24} color="#4DA8DA" />
          </TouchableOpacity> */}
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search patients..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>
      <ScrollView
        contentContainerStyle={
          filteredPatients.length === 0 ? styles.centered : undefined
        }
      >
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => renderPatientCard(patient))
        ) : (
          <Text style={styles.emptyText}>No patients found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20, // Add more space below the title
  },
  searchBar: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
  },
  // Remove filterRow, filterButton, filterButtonActive, filterButtonText, filterButtonTextActive styles
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#8DBCC7",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: '100%',
    marginHorizontal: 20,
  },
  patientInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patientDetails: { flex: 1 },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  patientTime: { fontSize: 14, color: "#6b7280" },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
