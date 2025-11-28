import { useEffect, useState } from "react";
import List from "./List";
import { SafeAreaView, ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface DepositorData {
    номер_вклада: string;
    название_вклада: string;
    фио_вкладчика: string;
    сумма_вклада: number;
    дата_вложения: string;
    процент_начисления: number;
    общая_сумма_с_начислениями: number;
}
export default function App() {
  const [data, setData] = useState<DepositorData[]>([]);
    const [totalInterestSum, setTotalInterestSum] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("");
    const [asc, setAsc] = useState(true);
    const API_URL = "http://192.168.0.103/api/read_depositors.php"; 

    useEffect(() => {
        fetch(API_URL)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error('Network response was not ok: ' + resp.statusText);
                }
                return resp.json();
            })
            .then((json) => {
                setData(json.records); 
                setTotalInterestSum(json.total_interest_sum);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                setError(error.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredData = data.filter(item => 
        item.название_вклада.toLowerCase().startsWith(filter.toLowerCase())
    );

    filteredData.sort((a, b) => {
        if (asc) {
            return a.название_вклада.localeCompare(b.название_вклада);
        } else {
            return b.название_вклада.localeCompare(a.название_вклада);
        }
    });

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Загрузка данных с PHP API...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={{ color: 'red' }}>Ошибка загрузки данных:</Text>
                <Text>{error}</Text>
                <Text>Проверьте IP-адрес в App.js и запущен ли OpenServer/MySQL.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <List 
                data={filteredData}
                totalSum={totalInterestSum}
                asc={asc}
                onFilter={(text:string) => { setFilter(text) }}
                onSort={() => { setAsc(!asc) }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});