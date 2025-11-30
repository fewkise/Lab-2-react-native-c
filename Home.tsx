import React, { useEffect, useState, useCallback } from "react"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import List, { DepositorData } from "./List"
import { ActivityIndicator, StyleSheet, Text, View, Button, Alert } from 'react-native'
import styles from "./styles"
import { Routes } from "./router"

const API_BASE_URL = "http://192.168.0.103/api/"

type HomeScreenNavigationProp = NativeStackNavigationProp<Routes, 'Home'>

const Home = () => {
    const navigation: any = useNavigation()
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
            if (json.records && json.records.length > 0) {
        setData(json.records)
        setTotalInterestSum(json.total_interest_sum)
            } else {
                setData([])
        setTotalInterestSum(0)
            }
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
        fetchData()
    }, [])

    const handleDelete = async (item: DepositorData) => {
         Alert.alert("Подтверждение", `Удалить вкладчика ${item.фио_вкладчика}?`, [
            { text: "Отмена", style: "cancel" },
            { text: "Удалить", onPress: async () => {
        try {
                    const response = await fetch(`${API_BASE_URL}delete_depositor.php`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ фио_вкладчика: item.фио_вкладчика, номер_вклада: item.номер_вклада }),
                    })
                    const result = await response.json()
                    if (response.ok) {
          fetchData()
                    } else {
          Alert.alert("Ошибка", result.message)
                    }
                } catch (error) {
                    Alert.alert("Ошибка сети", "Не удалось удалить запись.")
                }
            }}
        ])
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Загрузка данных с PHP API...</Text>
          </View>
      )
    }

    if (error) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>Ошибка загрузки данных:</Text>
              <Text>{error}</Text>
              <Text>Проверьте IP-адрес в Home.tsx и запущен ли ваш MySQL-сервер.</Text>
          </View>
      )
    }
    
    return (
        <View style={{flex: 1}}>
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

export default Home
