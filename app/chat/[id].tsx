import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Message {
  id: string;
  text: string;
  isDoctor: boolean;
  timestamp: Date;
}

export default function PatientChat() {
  const router = useRouter();
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name: string;
    avatar: string;
  }>();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello Doctor, I wanted to follow up on my recent test results.",
      isDoctor: false,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "2",
      text: "Hello! I've reviewed your results and they look very good. Your blood pressure has improved significantly.",
      isDoctor: true,
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
    },
    {
      id: "3",
      text: "That's great news! Should I continue with the current medication?",
      isDoctor: false,
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
    },
    {
      id: "4",
      text: "Yes, please continue with the current dosage. Let's schedule a follow-up in 2 weeks.",
      isDoctor: true,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        isDoctor: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleCall = () => {
    // Handle call functionality
    console.log(`Calling ${name}...`);
    // You can integrate with a calling service here
  };

  const handleVideoCall = () => {
    // Handle video call functionality
    console.log(`Video calling ${name}...`);
    // You can integrate with a video calling service here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.patientInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatar}</Text>
              </View>
              <View>
                <Text style={styles.patientName}>{name}</Text>
                <View style={styles.statusContainer}>
                  <View style={styles.onlineIndicator} />
                  <Text style={styles.onlineStatus}>Online</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.callButtons}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={20} color="#1A94E5" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleVideoCall}
              activeOpacity={0.7}
            >
              <Ionicons name="videocam" size={20} color="#1A94E5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isDoctor
                  ? styles.messageContainerDoctor
                  : styles.messageContainerPatient,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isDoctor
                    ? styles.messageBubbleDoctor
                    : styles.messageBubblePatient,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isDoctor
                      ? styles.messageTextDoctor
                      : styles.messageTextPatient,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="send"
                size={18}
                color={input.trim() ? "#ffffff" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1A94E5",
    marginRight: 6,
  },
  onlineStatus: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  callButtons: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  messageContainer: {
    marginVertical: 6,
  },
  messageContainerDoctor: {
    alignItems: "flex-end",
  },
  messageContainerPatient: {
    alignItems: "flex-start",
  },
  messageBubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "75%",
    minWidth: 60,
  },
  messageBubblePatient: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  messageBubbleDoctor: {
    backgroundColor: "#1A94E5",
    borderBottomRightRadius: 6,
    shadowColor: "#1A94E5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextPatient: {
    color: "#374151",
  },
  messageTextDoctor: {
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#374151",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 120,
    minHeight: 44,
    textAlignVertical: "center",
  },
  sendButton: {
    backgroundColor: "#1A94E5",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1A94E5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#f1f5f9",
    shadowOpacity: 0,
    elevation: 0,
  },
});
