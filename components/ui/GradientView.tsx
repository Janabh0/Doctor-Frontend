import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue, ViewStyle } from "react-native";

interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
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
  const getDefaultColors = (): readonly [ColorValue, ColorValue, ColorValue] => {
    switch (type) {
      case "blue":
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"] as const;
      case "avatar":
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"] as const;
      default:
        return ["#4DA8DA", "#3A9BCE", "#2A8EC2"] as const;
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
