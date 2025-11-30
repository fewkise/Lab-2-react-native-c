import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { DepositorData } from './List'
import styles from "./styles"


const API_BASE_URL = "192.168.0.103"

const FormScreen = () => {

    const navigation: any = useNavigation()
    const route: any = useRoute()
    const initialData: DepositorData | undefined = route.params?.initialData

    const [formData, setFormData] = useState<DepositorData>({
        номер_вклада: '',
            название_вклада: '',
        фио_вкладчика: '',
            сумма_вклада: 0,
        дата_вложения: new Date().toISOString().split('T')[0],
        процент_начисления: 0,
        ...initialData
    })

    const handleChange = (name: keyof DepositorData, value: string) => {
        const processedValue = (name === 'сумма_вклада' || name === 'процент_начисления') ? Number(value) : value
        setFormData(prev => ({ ...prev, [name]: processedValue }))
    }

    const handleSave = async () => {
        const finalSum = (Number(formData.сумма_вклада) || 0) * (1 + (Number(formData.процент_начисления) || 0) / 100)
        
        const dataToSave = {
            ...formData,
          сумма_вклада: Number(formData.сумма_вклада),
            процент_начисления: Number(formData.процент_начисления),
        }

        const method = initialData ? 'PUT' : 'POST'
        const url = initialData ? `${API_BASE_URL}update_depositor.php` : `${API_BASE_URL}create_depositor.php`

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            })

            const result = await response.json()
            if (response.ok) {
                Alert.alert("Успех", result.message)
                navigation.goBack()
            } else {
                Alert.alert("Ошибка API", result.message || "Неизвестная ошибка API")
            }
        } catch (error) {
            Alert.alert("Ошибка сети", "Не удалось подключиться к API. Проверьте IP-адрес и Firewall.")
            console.error(error)
        }
    }

    return (
        <ScrollView style={styles.listContainer}>
          <Text style={styles.header}>{initialData ? 'Редактировать вкладчика' : 'Добавить нового вкладчика'}</Text>
            
            <TextInput style={styles.input} placeholder="Номер вклада (VK...)" value={formData.номер_вклада} onChangeText={(t) => handleChange('номер_вклада', t)} editable={!initialData} />
            <TextInput style={styles.input} placeholder="Название вклада" value={formData.название_вклада} onChangeText={(t) => handleChange('название_вклада', t)} />
            <TextInput style={styles.input} placeholder="ФИО вкладчика" value={formData.фио_вкладчика} onChangeText={(t) => handleChange('фио_вкладчика', t)} editable={!initialData} />
            <TextInput style={styles.input} placeholder="Сумма вклада" value={String(formData.сумма_вклада)} onChangeText={(t) => handleChange('сумма_вклада', t)} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Дата вложения (YYYY-MM-DD)" value={formData.дата_вложения} onChangeText={(t) => handleChange('дата_вложения', t)} />
            
            <TextInput style={styles.input} placeholder="Процент начисления" value={String(formData.процент_начисления)} onChangeText={(t) => handleChange('процент_начисления', t)} keyboardType="numeric" />
            
            <Button title={initialData ? "Сохранить изменения" : "Добавить"} onPress={handleSave} />
        </ScrollView>
    )
}

export default FormScreen
