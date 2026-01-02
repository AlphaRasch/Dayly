import {View} from "react-native";
import {useEffect, useState} from "react";
import {supabase} from "@/utils/supabase";
import {Button, Text} from 'react-native-paper';
import axios from "axios";
import {useRouter} from "expo-router";

export default function QuestionsScreen() {
    const router = useRouter();
    const [isTodayAnswered, setIsTodayAnswered] = useState(false);
    const [answers, setAnswers] = useState([]);
    useEffect(()=> {
        const getAnswers = async() => {
            await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/dayly/answers/`)
                .then(
                    (response) => response.json()
                )
                .then(result => {
                    setAnswers(result)
                    console.log(result.map(item => new Date(item.date).toLocaleDateString() ), new Date().toLocaleDateString())
                })};
        getAnswers();
    }, []);
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
            <Text variant="headlineLarge" style={{ fontWeight: 'bold' }}>Сегодня</Text>
            <Text variant="headlineMedium">{new Date().toLocaleDateString()}</Text>
            <Button mode="contained" onPress={() => router.replace('/questions-start')}>
                {
                    answers.filter((item: any) =>  new Date(item.date).toLocaleDateString() === new Date().toLocaleDateString())?.length ?
                    'Посмотреть результаты за сегодня' : 'Ответить на вопросы'
                }
            </Button>
        </View>
    );
}