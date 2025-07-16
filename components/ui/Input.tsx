import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextStyle,
  TextInputProps,
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
    height: 48,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  focused: {
    borderColor: AppColors.primary,
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
