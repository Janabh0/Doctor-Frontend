import React from "react";
import { ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  type?: "blue" | "avatar";
}

export const GradientView: React.FC<GradientViewProps> = ({
  children,
  style,
  colors,
  start,
  end,
  type = "blue",
}) => {
  const getDefaultColors = () => {
    switch (type) {
      case "blue":
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"];
      case "avatar":
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"];
      default:
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"];
    }
  };

  const getDefaultStart = () => {
    switch (type) {
      case "blue":
        return { x: 0, y: 0 };
      case "avatar":
        return { x: 0, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const getDefaultEnd = () => {
    switch (type) {
      case "blue":
        return { x: 1, y: 1 };
      case "avatar":
        return { x: 1, y: 1 };
      default:
        return { x: 1, y: 1 };
    }
  };

  return (
    <LinearGradient
      colors={colors || getDefaultColors()}
      start={start || getDefaultStart()}
      end={end || getDefaultEnd()}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
