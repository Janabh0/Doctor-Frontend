import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface Patient {
  id: string;
  name: string;
  time: string;
  avatar: string;
  status: "today" | "upcoming";
}

const patientsData: Patient[] = [
  {
    id: "1",
    name: "Ethan Harper",
    time: "10:00 AM",
    avatar: "👨‍🦱",
    status: "today",
  },
  {
    id: "2",
    name: "Olivia Bennett",
    time: "11:30 AM",
    avatar: "👩‍🦰",
    status: "today",
  },
  {
    id: "3",
    name: "Noah Carter",
    time: "1:00 PM",
    avatar: "👨‍🦲",
    status: "today",
  },
  {
    id: "4",
    name: "Sophia Evans",
    time: "2:30 PM",
    avatar: "👩‍🦱",
    status: "today",
  },
  {
    id: "5",
    name: "Liam Foster",
    time: "6:00 PM",
    avatar: "👨‍💼",
    status: "upcoming",
  },
];

export default function PatientsPage() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "upcoming"
  >("all");
  const [searchText, setSearchText] = useState("");

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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{patient.avatar}</Text>
        </View>
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
        <View style={styles.headerTop}>
          <Text style={styles.brandText}>Stitch Design</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Patients</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color="#1A94E5" />
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
          {filteredPatients.map((patient) => renderPatientCard(patient))}
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
    backgroundColor: "#1A94E5",
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
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
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
    backgroundColor: "#f3f4f6",
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
});
