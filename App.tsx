import React, { useEffect, useState, useCallback } from "react";
import List, { DepositorData } from "./List";
import FormScreen from "./FormScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View, Button, Alert } from 'react-native';

const API_BASE_URL = "http://192.168.0.103/api/"
const Stack = createNativeStackNavigator()

const AppContent = ({ navigation }: { navigation: any }) => {
    const [data, setData] = useState<DepositorData[]>([])
    const [totalInterestSum, setTotalInterestSum] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
     const [error, setError] = useState<string | null>(null)
    const [filter, setFilter] = useState<string>("")
    const [asc, setAsc] = useState<boolean>(true)

    const fetchData = useCallback(async () => {
      setLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}read_depositors.php`)
            if (!response.ok) throw new Error('Ошибка сети: ' + response.statusText)
            const json = await response.json()
      setData(json.records)
      setTotalInterestSum(json.total_interest_sum)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Произошла неизвестная ошибка при загрузке данных.")
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData()
        })
        fetchData()
        return unsubscribe
    }, [navigation, fetchData])

    const handleDelete = async (item: DepositorData) => {
        try {
            const response = await fetch(`${API_BASE_URL}delete_depositor.php`, {
        method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ фио_вкладчика: item.фио_вкладчика, номер_вклада: item.номер_вклада }),
            })
            await response.json()
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (item: DepositorData) => {
        navigation.navigate('Form', { initialData: item })
    }

    const filteredData = data.filter(item => item.название_вклада.toLowerCase().startsWith(filter.toLowerCase()))
    filteredData.sort((a, b) => {
        if (asc) {
      return a.название_вклада.localeCompare(b.название_вклада)
        } else {
            return b.название_вклада.localeCompare(a.название_вклада)
        }
    })

    if (loading) {
        return (
            <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
                <Text>Загрузка данных с PHP API...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.center}>
        <Text style={{ color: 'red' }}>Ошибка загрузки данных:</Text>
                <Text>{error}</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
      <Button title="Добавить нового вкладчика" onPress={() => navigation.navigate('Form')} />
            <List
                data={filteredData}
                totalSum={totalInterestSum}
                asc={asc}
                onFilter={(text: string) => setFilter(text)}
                onSort={() => setAsc(!asc)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </View>
    )
}

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="List">
            <Stack.Screen name="List" component={AppContent} options={{ title: 'Список вкладчиков' }} />
            <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Редактирование' }} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
