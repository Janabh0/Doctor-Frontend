import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import { AppColors } from "../../constants/AppColors";

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  style,
  required = false,
}) => {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  required: {
    color: AppColors.error,
  },
});
