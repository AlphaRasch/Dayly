import { View } from "react-native";
import { Text , ActivityIndicator } from 'react-native-paper';
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
    const [isAnimated, setIsAnimated] = useState(true);
    useEffect(
        () => {
            const timer = setTimeout(()=> {
                setIsAnimated(false);
                router.replace('/hello');
            }, 5000)
            return () => {
                clearTimeout(timer);
            }
        },
        []
    )
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <View style={{
          width: 120,
          height: 120,
          backgroundColor: 'black',
      }}>
      </View>
      <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Dayly</Text>
      <ActivityIndicator animating={isAnimated} size="large" />
    </View>
  );
}
