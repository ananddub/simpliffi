import { CommonActions, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Dashboard() {
    const nav = useNavigation()
    const navigateToLogin = () => {
        nav.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
        )
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Image style={{ height: 150, width: 150, marginVertical: 10 }} source={{ uri: "https://t3.ftcdn.net/jpg/02/90/11/84/240_F_290118426_6TczUVvbYer1rZm32y1ftS1NqfZS7b24.jpg" }} />
            <TouchableOpacity
                style={styles.button}
                onPress={navigateToLogin}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#48d1cc',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
