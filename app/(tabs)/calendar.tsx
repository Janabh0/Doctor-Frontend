import { Appointment } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CalendarDay {
  date: number;
  hasAppointment: boolean;
  appointmentCount: number;
  isToday: boolean;
  isSelected: boolean;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const loading = false;

  // Hardcode the appointments array with Arabian names
  const appointments: Appointment[] = [
    {
      _id: 'a1',
      patient: { _id: 'p1', name: 'Ahmad Al-Farsi', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-01',
      time: '09:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2024-07-01T08:00:00Z',
      updatedAt: '2024-07-01T08:00:00Z',
    },
    {
      _id: 'a2',
      patient: { _id: 'p2', name: 'Fatima Al-Sabah', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-01',
      time: '11:30',
      type: 'offline',
      status: 'pending',
      createdAt: '2024-07-01T10:00:00Z',
      updatedAt: '2024-07-01T10:00:00Z',
    },
    {
      _id: 'a3',
      patient: { _id: 'p3', name: 'Layla Al-Mutairi', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-02',
      time: '14:00',
      type: 'online',
      status: 'pending',
      createdAt: '2024-07-02T13:00:00Z',
      updatedAt: '2024-07-02T13:00:00Z',
    },
    {
      _id: 'a4',
      patient: { _id: 'p4', name: 'Yousef Al-Sabah', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-03',
      time: '16:00',
      type: 'offline',
      status: 'confirmed',
      createdAt: '2024-07-03T15:00:00Z',
      updatedAt: '2024-07-03T15:00:00Z',
    },
    {
      _id: 'a5',
      patient: { _id: 'p5', name: 'Mona Al-Ajmi', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-04',
      time: '10:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2024-07-04T09:00:00Z',
      updatedAt: '2024-07-04T09:00:00Z',
    },
    {
      _id: 'a6',
      patient: { _id: 'p6', name: 'Salem Al-Mansour', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2024-07-05',
      time: '13:30',
      type: 'offline',
      status: 'pending',
      createdAt: '2024-07-05T12:00:00Z',
      updatedAt: '2024-07-05T12:00:00Z',
    },
    // Appointments for July 24, 2025
    {
      _id: 'july24-1',
      patient: { _id: 'p7', name: 'Omar Al-Khaled', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-24',
      time: '09:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2025-07-24T08:00:00Z',
      updatedAt: '2025-07-24T08:00:00Z',
    },
    {
      _id: 'july24-2',
      patient: { _id: 'p8', name: 'Sara Al-Harbi', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-24',
      time: '11:30',
      type: 'offline',
      status: 'pending',
      createdAt: '2025-07-24T10:00:00Z',
      updatedAt: '2025-07-24T10:00:00Z',
    },
    {
      _id: 'july24-3',
      patient: { _id: 'p9', name: 'Noura Al-Sabah', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-24',
      time: '14:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2025-07-24T13:00:00Z',
      updatedAt: '2025-07-24T13:00:00Z',
    },
    // Appointments for July 26, 2025
    {
      _id: 'july26-1',
      patient: { _id: 'p10', name: 'Huda Al-Mutairi', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-26',
      time: '10:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2025-07-26T09:00:00Z',
      updatedAt: '2025-07-26T09:00:00Z',
    },
    {
      _id: 'july26-2',
      patient: { _id: 'p11', name: 'Majed Al-Fahad', gender: 'male' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-26',
      time: '13:30',
      type: 'offline',
      status: 'pending',
      createdAt: '2025-07-26T12:00:00Z',
      updatedAt: '2025-07-26T12:00:00Z',
    },
    {
      _id: 'july26-3',
      patient: { _id: 'p12', name: 'Aisha Al-Saleh', gender: 'female' },
      doctor: { _id: 'd1', name: 'Dr. Hassan', speciality: 'Cardiology' },
      date: '2025-07-26',
      time: '18:00',
      type: 'online',
      status: 'confirmed',
      createdAt: '2025-07-26T17:00:00Z',
      updatedAt: '2025-07-26T17:00:00Z',
    },
  ];

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateStr = date.toISOString().split("T")[0];
      const count = appointments.filter(apt =>
        new Date(apt.date).toISOString().split("T")[0] === dateStr
      ).length;

      days.push({
        date: date.getDate(),
        hasAppointment: count > 0,
        appointmentCount: count,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    return days;
  };

  const handleDatePress = (index: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const selected = new Date(startDate);
    selected.setDate(startDate.getDate() + index);
    setSelectedDate(selected);
  };

  const getAppointmentsForDate = (): Appointment[] => {
    const selectedStr = selectedDate.toISOString().split("T")[0];
    return appointments.filter(apt =>
      new Date(apt.date).toISOString().split("T")[0] === selectedStr
    );
  };

  const getUpcomingAppointments = (): Appointment[] => {
    const today = new Date();
    return appointments
      .filter(apt => new Date(apt.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const renderAppointmentCard = (apt: Appointment) => {
    const status = apt.status || "confirmed";

    return (
      <TouchableOpacity
        key={apt._id}
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
            <Ionicons name="person" size={24} color="#ffffff" />
          </LinearGradient>
          <View style={styles.appointmentDetails}>
            <Text style={styles.patientName}>
              {apt.patient?.name || "No Name"}
            </Text>
            <Text style={styles.appointmentType}>
              {apt.type || "N/A"}
            </Text>
            <Text style={styles.appointmentTime}>
              {typeof apt.time === "string" ? apt.time : `${apt.time}:00`}
            </Text>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          status === "pending"
            ? styles.statusPending
            : status === "completed"
            ? styles.statusCompleted
            : styles.statusConfirmed
        ]}>
          <Text style={[
            styles.statusText,
            status === "pending"
              ? styles.statusTextPending
              : status === "completed"
              ? styles.statusTextCompleted
              : styles.statusTextConfirmed
          ]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calendarDays = generateCalendarDays();
  const selectedDateAppointments = getAppointmentsForDate();
  const upcomingAppointments = getUpcomingAppointments();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (aptDate: Date | string) => {
    const date = new Date(aptDate);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const todaysAppointments = appointments.filter(apt => isToday(apt.date));

  const total = todaysAppointments.length;
  const confirmed = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "confirmed").length;
  const pending = todaysAppointments.filter(apt => apt.status?.toLowerCase() === "pending").length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Calendar</Text>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="refresh-outline" size={24} color="#4DA8DA" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              <Ionicons name="chevron-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {dayNames.map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, i) => {
              // Find if this day has an appointment
              const year = currentMonth.getFullYear();
              const month = currentMonth.getMonth();
              const dateObj = new Date(year, month, day.date);
              const dateStr = dateObj.toISOString().split("T")[0];
              const hasAppointment = appointments.some(apt => apt.date === dateStr);
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleDatePress(i)}
                  style={[
                    styles.calendarDay,
                    day.isToday && styles.todayDay,
                    day.isSelected && styles.selectedDay,
                  ]}
                >
                  <Text style={[
                    styles.calendarDayText,
                    day.isSelected && styles.selectedDayText,
                  ]}>{day.date}</Text>
                  {hasAppointment && <View style={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: [{ translateX: -6 }],
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#2A4D5F',
                    borderWidth: 2,
                    borderColor: '#fff',
                  }} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointments for {selectedDate.toDateString()}</Text>
          <View style={styles.appointmentsList}>
            {loading ? (
              <Text style={styles.emptyText}>Loading appointments...</Text>
            ) : selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map(renderAppointmentCard)
            ) : (
              <Text style={styles.emptyText}>No appointments for this date</Text>
            )}
          </View>
        </View>

        {/* Removed Upcoming Appointments section here */}
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
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    paddingVertical: 20,
    fontSize: 16,
  },
});
