import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        header: () => null,
        animation: "slide_from_bottom",
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    />
  );
}
