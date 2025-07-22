"use client";
import { getPatientById } from "@/API/doctorAppointments";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PatientDetailsPage() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      const res = await getPatientById(patientId);
      if (res.success && res.data) {
        setPatient(res.data);
      }
      setLoading(false);
    };
    fetchPatient();
  }, [patientId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading patient details…</Text>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.centered}>
        <Text>Patient not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{patient.name}</Text>
      <Text style={styles.text}>Gender: {patient.gender ?? "N/A"}</Text>
      <Text style={styles.text}>Phone: {patient.phoneNum ?? "N/A"}</Text>

      {patient.dependents?.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.subtitle}>Dependents:</Text>
          {patient.dependents.map((dep: any) => (
            <Text key={dep._id} style={styles.text}>
              • {dep.name} ({dep.relation})
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
});
