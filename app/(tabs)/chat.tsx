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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface PatientMessage {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const patientsMessages: PatientMessage[] = [
  {
    id: "1",
    name: "Ethan Harper",
    lastMessage: "Thank you for the prescription, feeling much better now",
    timestamp: "2 min ago",
    avatar: "person",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Olivia Bennett",
    lastMessage: "When should I schedule my next appointment?",
    timestamp: "15 min ago",
    avatar: "person",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "3",
    name: "Noah Carter",
    lastMessage: "The test results look good, thank you doctor",
    timestamp: "1 hour ago",
    avatar: "person",
    isOnline: false,
  },
  {
    id: "4",
    name: "Sophia Evans",
    lastMessage: "I have some questions about my medication",
    timestamp: "3 hours ago",
    avatar: "person",
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: "5",
    name: "Liam Foster",
    lastMessage: "Thanks for the quick response!",
    timestamp: "Yesterday",
    avatar: "person",
    isOnline: false,
  },
  {
    id: "6",
    name: "Emma Wilson",
    lastMessage: "Could we reschedule tomorrow's appointment?",
    timestamp: "Yesterday",
    avatar: "person",
    unreadCount: 1,
    isOnline: false,
  },
];

export default function MessagesPage() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const filteredMessages = patientsMessages.filter((patient) =>
    patient.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePatientPress = (patient: PatientMessage) => {
    // Navigate to chat page with patient data
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: patient.id,
        name: patient.name,
        avatar: patient.avatar,
      },
    });
  };

  const renderMessageCard = (patient: PatientMessage) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.messageCard}
      activeOpacity={0.7}
      onPress={() => handlePatientPress(patient)}
    >
      <View style={styles.messageInfo}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons name={patient.avatar as any} size={24} color="#ffffff" />
          </LinearGradient>
          {patient.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.messageDetails}>
          <View style={styles.messageHeader}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.timestamp}>{patient.timestamp}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {patient.lastMessage}
          </Text>
        </View>
      </View>
      {patient.unreadCount && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{patient.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Messages</Text>
          <TouchableOpacity style={styles.composeButton} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={24} color="#4DA8DA" />
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
            placeholder="Search messages..."
            placeholderTextColor="#9ca3af"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Messages List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.messagesList}>
          {filteredMessages.map((patient) => renderMessageCard(patient))}
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
  composeButton: {
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
  content: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4DA8DA",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  messageDetails: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: "#4DA8DA",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
