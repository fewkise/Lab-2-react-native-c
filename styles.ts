import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sortButton: {
        backgroundColor: '#007bff',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 5,
    },
    sortButtonText: {
        color: 'white',
    },
    item: {
        backgroundColor: '#f3e1ffff',
        padding: 20,
        marginVertical: 8,
        borderColor: '#8150f4ff',
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalSum: {
        marginTop: 5,
        fontWeight: 'bold',
        color: 'green',
    },
    footer: {
        padding: 15,
        paddingBottom:100,
        backgroundColor: '#fad6ffff',
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#ffe2e2ff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerText: {
        fontSize: 20,
        color:'#000000ff',
    },
    totalSumValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff007bff',
    }
});
export default styles; 