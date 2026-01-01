import {View} from "react-native";
import { Text, Button } from 'react-native-paper';
import {useRouter} from "expo-router";

export default function HelloScreen() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <Text style={{fontWeight: 'bold', textAlign: 'center'}} variant="headlineLarge">5 минут, чтобы понять свой день</Text>
            <Text variant="headlineMedium" style={{ textAlign: 'center' }}>Ответь на несколько вопросов и получи резюме дня</Text>
            <Button mode="contained"  onPress={()=> {
                router.replace('/questions')
            }}>Начать</Button>
        </View>
    );
}