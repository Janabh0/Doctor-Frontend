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
import { Stack } from "expo-router";

interface CallHistory {
  id: string;
  patientName: string;
  date: string;
  time: string;
  duration: string;
  type: "incoming" | "outgoing" | "missed";
  status: "completed" | "missed" | "declined";
}

const callHistory: CallHistory[] = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    date: "Today",
    time: "2:30 PM",
    duration: "15 min",
    type: "incoming",
    status: "completed",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    date: "Today",
    time: "10:15 AM",
    duration: "8 min",
    type: "outgoing",
    status: "completed",
  },
  {
    id: "3",
    patientName: "Emily Davis",
    date: "Yesterday",
    time: "4:45 PM",
    duration: "0 min",
    type: "incoming",
    status: "missed",
  },
  {
    id: "4",
    patientName: "David Wilson",
    date: "Yesterday",
    time: "11:20 AM",
    duration: "22 min",
    type: "outgoing",
    status: "completed",
  },
  {
    id: "5",
    patientName: "Lisa Brown",
    date: "Dec 18",
    time: "3:10 PM",
    duration: "12 min",
    type: "incoming",
    status: "completed",
  },
  {
    id: "6",
    patientName: "Robert Taylor",
    date: "Dec 17",
    time: "9:30 AM",
    duration: "0 min",
    type: "outgoing",
    status: "declined",
  },
  {
    id: "7",
    patientName: "Jennifer Lee",
    date: "Dec 16",
    time: "1:45 PM",
    duration: "18 min",
    type: "incoming",
    status: "completed",
  },
  {
    id: "8",
    patientName: "Thomas Anderson",
    date: "Dec 15",
    time: "5:20 PM",
    duration: "25 min",
    type: "outgoing",
    status: "completed",
  },
];

export default function CallHistoryPage() {
  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return "call";
      case "outgoing":
        return "call-outline";
      case "missed":
        return "call-outline";
      default:
        return "call";
    }
  };

  const getCallTypeColor = (type: string, status: string) => {
    if (status === "missed" || status === "declined") {
      return "#ef4444";
    }
    switch (type) {
      case "incoming":
        return "#10b981";
      case "outgoing":
        return "#4DA8DA";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "missed":
        return "Missed";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  const renderCallCard = (call: CallHistory) => (
    <TouchableOpacity key={call.id} style={styles.callCard} activeOpacity={0.7}>
      <View style={styles.callInfo}>
        <View style={styles.callIconContainer}>
          <Ionicons
            name={getCallTypeIcon(call.type) as any}
            size={20}
            color={getCallTypeColor(call.type, call.status)}
          />
        </View>
        <View style={styles.callDetails}>
          <Text style={styles.patientName}>{call.patientName}</Text>
          <Text style={styles.callDate}>
            {call.date} • {call.time}
          </Text>
          <Text style={styles.callStatus}>{getStatusText(call.status)}</Text>
        </View>
      </View>
      <View style={styles.callDuration}>
        <Text style={styles.durationText}>{call.duration}</Text>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  const completedCalls = callHistory.filter((c) => c.status === "completed");
  const missedCalls = callHistory.filter(
    (c) => c.status === "missed" || c.status === "declined"
  );

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
            <Text style={styles.pageTitle}>Call History</Text>
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
            <Text style={styles.statNumber}>{callHistory.length}</Text>
            <Text style={styles.statLabel}>Total Calls</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedCalls.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{missedCalls.length}</Text>
            <Text style={styles.statLabel}>Missed</Text>
          </View>
        </View>

        {/* Call History List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.callList}>
            {callHistory.map((call) => renderCallCard(call))}
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
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
  },
  callList: {
    paddingHorizontal: 20,
  },
  callCard: {
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
  callInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  callIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  callDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  callDate: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  callStatus: {
    fontSize: 14,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  callDuration: {
    alignItems: "flex-end",
  },
  durationText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
});
