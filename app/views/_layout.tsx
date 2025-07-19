import { Stack } from "expo-router";

export default function ViewsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        header: () => null,
        animation: "none",
      }}
    />
  );
}
