import {ActivityIndicator, Button, Text, TextInput} from 'react-native-paper';
import {View} from "react-native";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
export default function SummaryScreen() {
    const router = useRouter();
    const  [summary, setSummary] = useState<null | string>(null);
    useEffect(() => {
        const getDaylyResult = async () => {
            const results = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/dayly/results`)
                .then(res => {

                    return res.text();
                });
            console.log('string results=',results);
            const aiResult = await fetch(`${process.env.EXPO_PUBLIC_AI_URL}/chat`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "model": "gemma3:1b",
                    "messages": [
                        {
                            "role": "user",
                            "content": `Сгенерируй ответ (пару предложений) как у человека прошел день на основе его ответов из следующей строки '${results}', ты описываешь как у человека прошел день (в роли наблюдателя, а не в лице человека)`
                        }
                    ],
                    "stream": false
                }),
            })
                .then(res => {
                    console.log(res)
                    return res.json()
                })
                .then(res => {
                    console.log('ai res=',res);
                    setSummary(res?.message?.content ?? 'Произошла ошибка в генерации ответа');
                })
        }
        getDaylyResult();
    }, []);
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {summary === null && (
                <>
                    <Text variant="headlineLarge">Генерируем результат...</Text>
                    <ActivityIndicator animating={true} size="large"/>
                </>
            )}
            {summary !== null && (
                <>
                    <Text variant="headlineLarge" style={{fontWeight: 'bold'}}>Резюме дня</Text>
                    <Text variant="headlineMedium" style={{textAlign: 'center'}}>{summary}</Text>
                    <Button mode="outlined" onPress={() => router.replace('/hello')}>Готово</Button>
                </>
            )}
        </View>
    )
}