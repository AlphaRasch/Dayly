import { View } from "react-native";
import IconButton from "react-native-paper/src/components/IconButton/IconButton";
import {ActivityIndicator, Button, Text, TextInput} from 'react-native-paper';
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";

export default function QuestionsStart() {
    const [questions, setQuestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isQuestionGenerated, setIsQuestionGenerated] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<null | string>(null);
    const router = useRouter();
    const handleSaveDraftAnswers = () => {

        const draftAnswers = questions.map(() => ({question: '', answer: '', date: ''}));
        draftAnswers[selectedIndex].question = questions[selectedIndex]!.question;
        draftAnswers[selectedIndex].answer = currentAnswer as string;
        draftAnswers[selectedIndex].date = new Date().toLocaleDateString();
        setAnswers(prev => {
            const toSaveArray = prev;
            // @ts-ignore
            toSaveArray[selectedIndex]=(draftAnswers[selectedIndex].question !== '' ? draftAnswers[selectedIndex] : answers[selectedIndex]);
            return toSaveArray;
        })
    }
    useEffect(()=> {
        const getQuestions = async() => {
            // await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/dayly/questions/`)
            //     .then(
            //         (response) => response.json()
            //     )
            //     .then(result => {
            //         setQuestions(result);
            //         // console.log(result);
            //     })
            // const ollama = new Ollama({
            //     host: process.env.EXPO_PUBLIC_AI_URL
            // });
            // const response = await ollama.chat({
            //     model: 'gemma3:1b',
            //     messages: [{ role: 'user', content: 'Сгенерируй 3 вопроса для резюме дня'}]
            //
            // });
            const response = await fetch(`${process.env.EXPO_PUBLIC_AI_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "model": "gemma3:1b",
                    "messages": [
                        {
                            "role": "user",
                            "content": "Сгенерируй 3 вопроса для оценки того, как прошел день у человека. Ответ должен быть строго в формате JSON массива объектов с полями id (число) и question (строка). Пример: [{\"id\": 0, \"question\": \"Какой момент дня был самым лучшим?\"}]"
                        }
                    ],
                    "format": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "integer"},
                                "question": {"type": "string"}
                            },
                            "required": ["id", "question"]
                        }
                    },
                    "stream": false
                })
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    return JSON.parse(result?.message?.content)
                })
            console.log(response);
            setIsQuestionGenerated(true);
            setQuestions(response);
        };
        const getAnswers= async () => {
            await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/dayly/answers/`)
                .then(response => response.json())
                .then(result => {
                    console.log('already answered', result);
                    if (result.length) {
                        setAnswers(result.map(item => ({
                            question: item.question,
                            answer: item.answer,
                            date: new Date(item.date).toLocaleDateString(),
                        })));
                        setIsAnswered(true);
                    }
                })
        }
        if (!isQuestionGenerated) getQuestions();
        getAnswers();
    }, []);
    console.log(answers);
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
        }}>
            {!isQuestionGenerated && <ActivityIndicator animating={!isQuestionGenerated} size="large"/>}
            {isQuestionGenerated && (
                <>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 16,
                            alignItems: 'center',
                        }}
                    >
                        <IconButton icon="arrow-left" size={30} onPress={() => {
                            if (selectedIndex > 0) {
                                handleSaveDraftAnswers();
                                setCurrentAnswer(null);
                                setSelectedIndex(prev => prev - 1)
                            }
                        }}/>
                        <Text variant="headlineLarge">{`${selectedIndex+1}/${questions.length}`}</Text>
                        <IconButton icon="arrow-right" size={30} onPress={() => {
                            if (selectedIndex < questions.length-1) {
                                handleSaveDraftAnswers();
                                setCurrentAnswer(null);
                                setSelectedIndex(prev => prev + 1);
                            }
                        }}/>
                    </View>
                    <Text variant="headlineMedium" style={{ textAlign: 'center'}}>{questions[selectedIndex]?.question ?? 'error'}</Text>
                    <TextInput style={{
                        width: 250,
                        height: 80,
                    }} mode="outlined" value={currentAnswer !== null ? currentAnswer : answers[selectedIndex]?.answer} onChangeText={text => setCurrentAnswer(text)}/>
                    {selectedIndex === questions.length - 1 && !isAnswered && <Button mode="outlined" onPress={async ()=> {
                        handleSaveDraftAnswers();
                        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/dayly/answers`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(answers)
                        });
                        router.replace('/summary')
                    }}>Сохранить</Button>}
                </>
            )}

        </View>
    )
}

/*
* Вот пример коротких ответов и резюме дня:

**1. Что сегодня было самым важным или полезным?**
Удалось сосредоточиться на главных задачах и не отвлекаться на мелочи.

**2. Что получилось хорошо, а что можно было сделать лучше?**
Хорошо получилось довести начатое до конца. Можно было лучше распределить время и сделать паузы для отдыха.

**3. Какой маленький вывод или урок я беру с собой на завтра?**
Если заранее планировать шаги, день проходит спокойнее и продуктивнее.

---

### Небольшое резюме дня

День был полезным и достаточно продуктивным. Основные задачи выполнены, появился опыт более осознанного отношения ко времени. Завтра стоит уделить больше внимания балансу между работой и отдыхом.

* */