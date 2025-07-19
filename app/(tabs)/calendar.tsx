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
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  date: string;
  avatar: string;
  status: "confirmed" | "pending" | "completed";
}

interface CalendarDay {
  date: number;
  hasAppointment: boolean;
  appointmentCount: number;
  isToday: boolean;
  isSelected: boolean;
}

const appointmentsData: Appointment[] = [
  {
    id: "1",
    patientName: "Ethan Harper",
    time: "9:00 AM",
    type: "Routine Checkup",
    date: "2024-01-15",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Olivia Bennett",
    time: "10:30 AM",
    type: "Follow-up",
    date: "2024-01-15",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Noah Carter",
    time: "2:00 PM",
    type: "Lab Results",
    date: "2024-01-16",
    avatar: "person",
    status: "pending",
  },
  {
    id: "4",
    patientName: "Sophia Evans",
    time: "11:00 AM",
    type: "Consultation",
    date: "2024-01-17",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "5",
    patientName: "Liam Foster",
    time: "3:30 PM",
    type: "Physical Exam",
    date: "2024-01-18",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "6",
    patientName: "Emma Wilson",
    time: "9:30 AM",
    type: "Dermatology",
    date: "2024-01-19",
    avatar: "person",
    status: "pending",
  },
  {
    id: "7",
    patientName: "James Miller",
    time: "1:15 PM",
    type: "Cardiology",
    date: "2024-01-22",
    avatar: "person",
    status: "confirmed",
  },
  {
    id: "8",
    patientName: "Sarah Davis",
    time: "4:00 PM",
    type: "Pediatrics",
    date: "2024-01-23",
    avatar: "person",
    status: "confirmed",
  },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dateString = currentDate.toISOString().split("T")[0];
      const appointmentCount = appointmentsData.filter(
        (apt) => apt.date === dateString
      ).length;

      days.push({
        date: currentDate.getDate(),
        hasAppointment: appointmentCount > 0,
        appointmentCount,
        isToday: currentDate.toDateString() === today.toDateString(),
        isSelected: currentDate.toDateString() === selectedDate.toDateString(),
      });
    }

    return days;
  };

  const getAppointmentsForSelectedDate = (): Appointment[] => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    return appointmentsData.filter((apt) => apt.date === selectedDateString);
  };

  const getUpcomingAppointments = (): Appointment[] => {
    const today = new Date().toISOString().split("T")[0];
    return appointmentsData
      .filter((apt) => apt.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDatePress = (dayIndex: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const selectedDay = new Date(startDate);
    selectedDay.setDate(startDate.getDate() + dayIndex);
    setSelectedDate(selectedDay);
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case "confirmed":
          return styles.statusConfirmed;
        case "pending":
          return styles.statusPending;
        case "completed":
          return styles.statusCompleted;
        default:
          return styles.statusConfirmed;
      }
    };

    const getStatusTextStyle = (status: string) => {
      switch (status) {
        case "confirmed":
          return styles.statusTextConfirmed;
        case "pending":
          return styles.statusTextPending;
        case "completed":
          return styles.statusTextCompleted;
        default:
          return styles.statusTextConfirmed;
      }
    };

    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        activeOpacity={0.7}
      >
        <View style={styles.appointmentInfo}>
          <LinearGradient
            colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons
              name={appointment.avatar as any}
              size={24}
              color="#ffffff"
            />
          </LinearGradient>
          <View style={styles.appointmentDetails}>
            <Text style={styles.patientName}>{appointment.patientName}</Text>
            <Text style={styles.appointmentType}>{appointment.type}</Text>
            <Text style={styles.appointmentTime}>{appointment.time}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(appointment.status)]}>
          <Text
            style={[styles.statusText, getStatusTextStyle(appointment.status)]}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calendarDays = generateCalendarDays();
  const selectedDateAppointments = getAppointmentsForSelectedDate();
  const upcomingAppointments = getUpcomingAppointments();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Appointments</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color="#4DA8DA" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              onPress={handlePreviousMonth}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  day.isToday && styles.todayDay,
                  day.isSelected && styles.selectedDay,
                ]}
                onPress={() => handleDatePress(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    day.isToday && styles.todayDayText,
                    day.isSelected && styles.selectedDayText,
                  ]}
                >
                  {day.date}
                </Text>
                {day.hasAppointment && (
                  <View style={styles.appointmentDot}>
                    {day.appointmentCount > 1 && (
                      <Text style={styles.appointmentCount}>
                        {day.appointmentCount}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Appointments */}
        {selectedDateAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedDate.toDateString() === new Date().toDateString()
                ? "Today's Appointments"
                : `Appointments for ${selectedDate.toLocaleDateString()}`}
            </Text>
            <View style={styles.appointmentsList}>
              {selectedDateAppointments.map((appointment) =>
                renderAppointmentCard(appointment)
              )}
            </View>
          </View>
        )}

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <View style={styles.appointmentsList}>
            {upcomingAppointments.map((appointment) =>
              renderAppointmentCard(appointment)
            )}
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
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
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
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    width: 40,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },
  todayDay: {
    backgroundColor: "#e6f3ff",
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: "#4DA8DA",
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  todayDayText: {
    color: "#4DA8DA",
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  appointmentDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4DA8DA",
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentCount: {
    fontSize: 8,
    color: "#ffffff",
    fontWeight: "600",
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
  appointmentsList: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
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
  appointmentInfo: {
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
  appointmentDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#4DA8DA",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusCompleted: {
    backgroundColor: "#e0e7ff",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextConfirmed: {
    color: "#16a34a",
  },
  statusTextPending: {
    color: "#d97706",
  },
  statusTextCompleted: {
    color: "#4f46e5",
  },
});
