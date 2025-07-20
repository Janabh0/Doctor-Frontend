import { apiService } from "@/services/api";
import { authStorage } from "@/services/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
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
  _id: string;
  name: string;
  email: string;
  phoneNum: string;
  civilID: string;
}

interface SearchResult {
  _id: string;
  name: string;
  email: string;
  phoneNum: string;
  civilID?: string;
  type: 'patient' | 'appointment';
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: string;
}

export default function SearchPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = await authStorage.getAuthToken();
      if (!token) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      console.log('🔍 Searching for:', searchQuery);
      
      // Search through appointments to find patients
      const appointmentsResponse = await apiService.getDoctorAppointments(token);
      
      if (appointmentsResponse.success && appointmentsResponse.data) {
        const appointments = appointmentsResponse.data;
        const results: SearchResult[] = [];

        // Search in appointments for patient names, emails, etc.
        appointments.forEach(appointment => {
          const patient = appointment.patient;
          if (patient) {
            const searchLower = searchQuery.toLowerCase();
            const nameMatch = patient.name?.toLowerCase().includes(searchLower);
            const emailMatch = patient.email?.toLowerCase().includes(searchLower);
            const phoneMatch = patient.phoneNum?.includes(searchQuery);

            if (nameMatch || emailMatch || phoneMatch) {
              results.push({
                                 _id: patient._id,
                 name: patient.name,
                 email: patient.email,
                 phoneNum: patient.phoneNum,
                type: 'appointment',
                appointmentDate: appointment.date,
                appointmentTime: typeof appointment.time === 'string' ? appointment.time : `${appointment.time}:00`,
                appointmentType: appointment.type,
              });
            }
          }
        });

        // Remove duplicates based on patient ID
        const uniqueResults = results.filter((result, index, self) => 
          index === self.findIndex(r => r._id === result._id)
        );

        setSearchResults(uniqueResults);
        console.log('🔍 Search results:', uniqueResults.length, 'patients found');
        
        // Add to recent searches
        if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
          setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
        }
      } else {
        console.error('❌ Failed to search appointments:', appointmentsResponse.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('💥 Search error:', error);
      Alert.alert('Error', 'Failed to search patients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientPress = (patient: SearchResult) => {
    console.log('👤 Patient selected:', patient);
    // Navigate to patient details or appointment details
    if (patient.type === 'appointment') {
      // Find the appointment for this patient
      // For now, just show an alert with patient info
             Alert.alert(
         'Patient Information',
         `Name: ${patient.name}\nEmail: ${patient.email}\nPhone: ${patient.phoneNum}${patient.civilID ? `\nCivil ID: ${patient.civilID}` : ''}\n\nAppointment: ${patient.appointmentDate} at ${patient.appointmentTime}\nType: ${patient.appointmentType}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Details', onPress: () => {
            // TODO: Navigate to patient/appointment details
            console.log('Navigate to patient details');
          }}
        ]
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#4DA8DA" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Search Patients</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => {
              console.log('🔄 Manual refresh triggered');
              clearSearch();
              setRecentSearches([]);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={24} color="#4DA8DA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email, phone, or Civil ID..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}
        >
          <Text style={styles.searchButtonText}>
            {isLoading ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        {recentSearches.length > 0 && searchQuery.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
                onPress={() => {
                  setSearchQuery(search);
                  setTimeout(handleSearch, 100);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isLoading ? 'Searching...' : `Search Results (${searchResults.length})`}
            </Text>
            
            {searchResults.length > 0 ? (
              searchResults.map((patient) => (
                <TouchableOpacity
                  key={patient._id}
                  style={styles.patientCard}
                  onPress={() => handlePatientPress(patient)}
                  activeOpacity={0.7}
                >
                  <View style={styles.patientInfo}>
                    <LinearGradient
                      colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatar}
                    >
                      <Ionicons name="person" size={20} color="#ffffff" />
                    </LinearGradient>
                    <View style={styles.patientDetails}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <Text style={styles.patientEmail}>{patient.email}</Text>
                      <Text style={styles.patientPhone}>{patient.phoneNum}</Text>
                      {patient.type === 'appointment' && (
                        <Text style={styles.appointmentInfo}>
                          📅 {patient.appointmentDate} at {patient.appointmentTime} - {patient.appointmentType}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))
            ) : !isLoading ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No patients found</Text>
                <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Search Tips */}
        {searchQuery.length === 0 && searchResults.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Tips</Text>
            <View style={styles.tipsContainer}>
              <View style={styles.tipItem}>
                <Ionicons name="person-outline" size={20} color="#4DA8DA" />
                <Text style={styles.tipText}>Search by patient name</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="mail-outline" size={20} color="#4DA8DA" />
                <Text style={styles.tipText}>Search by email address</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="call-outline" size={20} color="#4DA8DA" />
                <Text style={styles.tipText}>Search by phone number</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="card-outline" size={20} color="#4DA8DA" />
                <Text style={styles.tipText}>Search by Civil ID</Text>
              </View>
            </View>
          </View>
        )}
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
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  headerRight: {
    width: 32,
  },
  refreshButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: "#4DA8DA",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
  },
  recentSearchText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  patientPhone: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  appointmentInfo: {
    fontSize: 12,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  tipsContainer: {
    paddingHorizontal: 20,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tipText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
  },
}); 