import { apiService, Appointment } from "@/services/api";
import { authStorage } from "@/services/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Patient {
  id: string;
  name: string;
  time: string;
  avatar: string;
  status: "today" | "upcoming";
}

export default function PatientsPage() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "upcoming"
  >("all");
  const [searchText, setSearchText] = useState("");
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

  // Convert appointments to patient format
  const patientsData: Patient[] = appointments.map(apt => {
    const appointmentDate = new Date(apt.date);
    const today = new Date();
    const isToday = appointmentDate.toDateString() === today.toDateString();
    
    return {
      id: apt._id,
      name: apt.patient?.name || `${apt.type} - ${appointmentDate.toLocaleDateString()}`,
      time: typeof apt.time === 'string' ? apt.time : `${apt.time}:00`,
      avatar: "person",
      status: isToday ? "today" : "upcoming",
    };
  });

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || patient.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
          <Ionicons name={patient.avatar as any} size={24} color="#ffffff" />
        </LinearGradient>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientTime}>{patient.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Patients</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color="#4DA8DA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "all" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("all")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "today" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("today")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "today" && styles.activeFilterText,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "upcoming" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("upcoming")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "upcoming" && styles.activeFilterText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.patientsList}>
          {loading ? (
            <Text style={styles.emptyText}>Loading patients...</Text>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => renderPatientCard(patient))
          ) : (
            <Text style={styles.emptyText}>
              {searchText ? 'No patients found matching your search' : 'No patients found'}
            </Text>
          )}
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
    paddingTop: 40, // Increased from 16 to create space from clock
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
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
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
  },
  activeFilterTab: {
    backgroundColor: "#4DA8DA",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  patientsList: {
    paddingHorizontal: 20,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
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
  avatarText: {
    fontSize: 24,
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
  patientTime: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
});
