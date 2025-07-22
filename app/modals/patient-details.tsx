import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { apiService } from "@/services/api"; // Uncomment if you have a backend

type Message = {
  id: string;
  text: string;
  isDoctor: boolean;
  timestamp: Date;
};

export default function PatientDetailsPage() {
  const { patientId } = useLocalSearchParams();
  const router = useRouter();
  // Hardcoded info for each patient
  const patientMap: Record<string, {
    name: string;
    civilId: string;
    gender: string;
    age: number;
    medicalHistory: string;
    caregiver: string;
    appointmentCount: number;
    appointmentTypes: string;
    avatar: string;
  }> = {
    p1: {
      name: 'Ahmad Al-Farsi',
      civilId: '123456123456',
      gender: 'Male',
      age: 32,
      medicalHistory: 'Hypertension, Asthma',
      caregiver: 'No',
      appointmentCount: 3,
      appointmentTypes: 'Online, Offline',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    p2: {
      name: 'Fatima Al-Sabah',
      civilId: '234567234567',
      gender: 'Female',
      age: 28,
      medicalHistory: 'Diabetes',
      caregiver: 'Yes',
      appointmentCount: 2,
      appointmentTypes: 'Offline',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    p3: {
      name: 'Layla Al-Mutairi',
      civilId: '345678345678',
      gender: 'Female',
      age: 40,
      medicalHistory: 'None',
      caregiver: 'No',
      appointmentCount: 1,
      appointmentTypes: 'Online',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    p4: {
      name: 'Yousef Al-Sabah',
      civilId: '456789456789',
      gender: 'Male',
      age: 36,
      medicalHistory: 'Heart Disease',
      caregiver: 'No',
      appointmentCount: 4,
      appointmentTypes: 'Offline',
      avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    },
    p5: {
      name: 'Mona Al-Ajmi',
      civilId: '567890567890',
      gender: 'Female',
      age: 22,
      medicalHistory: 'Asthma',
      caregiver: 'Yes',
      appointmentCount: 2,
      appointmentTypes: 'Online',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    p6: {
      name: 'Salem Al-Mansour',
      civilId: '678901678901',
      gender: 'Male',
      age: 50,
      medicalHistory: 'Hypertension',
      caregiver: 'No',
      appointmentCount: 5,
      appointmentTypes: 'Online, Offline',
      avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    },
  };
  const patient = patientMap[patientId as string] || {
    name: 'Unknown',
    civilId: 'Unknown',
    gender: 'Unknown',
    age: 0,
    medicalHistory: 'Unknown',
    caregiver: 'Unknown',
    appointmentCount: 0,
    appointmentTypes: 'Unknown',
    avatar: '',
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff', flex: 1 }} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={28} color="#4DA8DA" />
      </TouchableOpacity>
      {/* Top Card with Avatar, Name, Civil ID */}
      <View style={styles.topCard}>
        <View style={styles.avatarContainerLarge}>
          <LinearGradient
            colors={["#4DA8DA", "#3A9BCE", "#2A8EC2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarLarge}
          >
            {/* If you want to use a real image, use Image component here */}
            {/* <Image source={{ uri: patient.avatar }} style={styles.avatarLarge} /> */}
            <Ionicons name="person" size={56} color="#fff" />
          </LinearGradient>
        </View>
        <Text style={styles.patientNameLarge}>{patient.name}</Text>
        <Text style={styles.patientCivilId}>{patient.civilId}</Text>
      </View>
      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color="#4DA8DA" />
          <Text style={styles.actionLabel}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="pricetag-outline" size={22} color="#4DA8DA" />
          <Text style={styles.actionLabel}>Voucher</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
          <Ionicons name="time-outline" size={22} color="#4DA8DA" />
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>
      {/* Info List */}
      <View style={styles.infoList}>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Name</Text>
          <Text style={styles.infoValueCard}>{patient.name}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="male-female-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Gender</Text>
          <Text style={styles.infoValueCard}>{patient.gender}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Age</Text>
          <Text style={styles.infoValueCard}>{patient.age}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="medkit-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Medical History</Text>
          <Text style={styles.infoValueCard}>{patient.medicalHistory}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="people-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Caregiver</Text>
          <Text style={styles.infoValueCard}>{patient.caregiver}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="stats-chart-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Appointments</Text>
          <Text style={styles.infoValueCard}>{patient.appointmentCount}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRowCard} activeOpacity={0.7}>
          <Ionicons name="swap-horizontal-outline" size={20} color="#4DA8DA" style={styles.infoIcon} />
          <Text style={styles.infoLabelCard}>Types</Text>
          <Text style={styles.infoValueCard}>{patient.appointmentTypes}</Text>
          <Ionicons name="chevron-forward" size={18} color="#b0b0b0" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 90,
    left: 12,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  topCard: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 18,
    backgroundColor: '#fff',
    marginTop: 32,
  },
  avatarContainerLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientNameLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  patientEmail: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 8,
  },
  patientCivilId: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 18,
    marginTop: 2,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  actionLabel: {
    fontSize: 13,
    color: '#222',
    marginTop: 4,
    fontWeight: '500',
  },
  infoList: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  infoRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8DBCC7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabelCard: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    flex: 1,
  },
  infoValueCard: {
    fontSize: 15,
    color: '#444',
    fontWeight: '400',
    marginRight: 8,
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: 120,
  },
});
