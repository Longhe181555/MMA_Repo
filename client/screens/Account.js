import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useCart } from "../context/cartContext";
import FooterMenu from "../components/Menus/FooterMenu";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = ({ navigation }) => {
    const [state, setState] = useContext(AuthContext);
    const { clearCart } = useCart();
    const { user, token } = state;
    //local state
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState(user?.password);
    const [loading, setLoading] = useState(false);

    //handle update user data
    const handleUpdate = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put("/auth/update-user", {
                name,
                password,
                email,
            }, {
                headers: {
                    Authorization: `Bearer ${token && token}`
                }
            });
            setLoading(false);
            let UD = JSON.stringify(data);
            setState({ ...state, user: UD?.updateUser })
            alert(data && data.message)
        } catch (error) {
            alert(error.response.data.message);
            setLoading(false);
            console.log("error: ", error);
        }
    };

    const handleLogout = async () => {
        setState({ token: "", user: null });
        clearCart();
        await AsyncStorage.removeItem("@auth");
        alert("Logout Successfully");
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="account-circle" size={80} color="#6200ea" />
                <Text style={styles.userName}>{state?.user?.name}</Text>
                <Text style={styles.userEmail}>{state?.user?.email}</Text>
            </View>

            <View style={styles.content}>
                {state?.user?.role === "admin" && (
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("AdminDashboard")}
                    >
                        <Icon name="dashboard" size={24} color="#6200ea" />
                        <Text style={styles.menuText}>Admin Dashboard</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("TransactionHistory")}
                >
                    <Icon name="receipt" size={24} color="#6200ea" />
                    <Text style={styles.menuText}>Order History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Icon name="logout" size={24} color="#f44336" />
                    <Text style={[styles.menuText, { color: '#f44336' }]}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FooterMenu />
        </View>
    );
};

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        elevation: 2,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
    },
});
