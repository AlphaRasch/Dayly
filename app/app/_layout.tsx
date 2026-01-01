import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{headerShown: false}} />
    <Stack.Screen name="hello" options={{headerShown: false}} />
    <Stack.Screen name="questions" options={{headerShown: false}} />
    <Stack.Screen name="questions-start" options={{headerShown: false}} />
    <Stack.Screen name="summary" options={{headerShown: false}} />
  </Stack>;
}
