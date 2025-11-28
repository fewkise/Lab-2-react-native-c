
import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import styles from './styles'
export interface DepositorData {
    номер_вклада: string;
    название_вклада: string;
    фио_вкладчика: string;
    сумма_вклада: number;
    дата_вложения: string;
    процент_начисления: number;
    общая_сумма_с_начислениями: number;
}

interface ListProps {
    data: DepositorData[];
    totalSum: number;
    asc: boolean;
    onFilter: (text: string) => void;
    onSort: () => void;
}

const ListItem = ({ item }: { item: DepositorData }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{item.название_вклада}</Text>
        <Text>ФИО: {item.фио_вкладчика}</Text>
        <Text>Сумма вклада: {item.сумма_вклада} руб.</Text>
        <Text style={styles.totalSum}>
            Процент начисления: {item.процент_начисления}%
        </Text>
        <Text style={styles.totalSum}>
            Общая сумма: {item.общая_сумма_с_начислениями} руб.
        </Text>
    </View>
);

export default function List({ data, totalSum, asc, onFilter, onSort }: ListProps) {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.header}>🐿️Ведомость вкладов 🐿️</Text>
            <Text style={{fontSize:20, fontWeight:600}}>🐥Лабораторная работа №2🐥</Text>
            <Text style={{fontSize:20, fontWeight:500}}>🐥Задание №13🐥</Text>
            <Text>Составить ведомость вкладов по названию с указанием суммы с начислениями; определить общую сумму начислений по всем видам вкладов.</Text>
            <View style={styles.controls}>
                <TextInput
                    style={styles.input}
                    placeholder="Фильтр по названию вклада"
                    onChangeText={onFilter}
                />
            </View>

            <FlatList
                data={data}
                renderItem={({ item }) => <ListItem item={item} />}
                keyExtractor={(item) => item.фио_вкладчика + item.номер_вклада}
            />
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    🐬Общая сумма начислений по всем вкладам (SUM(`общая сумма с начислениями` - `сумма вклада`)): 
                </Text>
                <Text style={styles.totalSumValue}>
                    {totalSum} руб.
                </Text>
            </View>
        </View>
    );
}