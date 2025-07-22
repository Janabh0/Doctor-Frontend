import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import { AppColors } from "../../constants/AppColors";

interface InputProps extends TextInputProps {
  style?: TextStyle;
  textStyle?: TextStyle;
  error?: boolean;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  style,
  textStyle,
  error = false,
  errorMessage,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholderTextColor="#9ca3af"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#2A4D5F',
    borderRadius: 8,
    paddingHorizontal: 20,
    width: '100%',
    paddingVertical: 16,
    fontSize: 18,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  focused: {
    borderColor: '#2A4D5F',
    borderWidth: 2,
  },
  error: {
    borderColor: AppColors.error,
  },
  text: {
    fontSize: 16,
    color: "#111827",
  },
});
