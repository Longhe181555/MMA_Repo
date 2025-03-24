import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home";
import Register from "../../screens/auth/Register";
import Login from "../../screens/auth/Login";
import { AuthContext } from "../../context/authContext";
import HeadrMenu from "./HeadrMenu";
import Post from "../../screens/Post";
import About from "../../screens/About";
import Account from "../../screens/Account";
import CartScreen from "../../screens/CartScreen";
import ProductDetail from "../../screens/ProductDetail";
import { useCart } from "../../context/cartContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import TransactionHistory from "../../screens/TransactionHistory";
import AdminDashboard from "../../screens/AdminDashboard";

const CartIcon = ({ navigation }) => {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            style={styles.cartIconContainer}
        >
            <Icon name="shopping-cart" size={24} color="#000" />
            {itemCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const ScreeMenu = () => {
    //global state
    const [state] = useContext(AuthContext);
    //auth condition true false
    const authenticatedUser = state?.user && state.token;
    const isAdmin = state?.user?.role === "admin";
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Login">
            {authenticatedUser ? (
                <>
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={({ navigation }) => ({
                            title: "Shop",
                            headerRight: () => (
                                <View style={styles.headerRight}>
                                    <CartIcon navigation={navigation} />
                                    <HeadrMenu />
                                </View>
                            ),
                        })}
                    />
                    {isAdmin && (
                        <Stack.Screen
                            name="AdminDashboard"
                            component={AdminDashboard}
                            options={{
                                title: "Admin Dashboard",
                                headerBackTitle: "Back"
                            }}
                        />
                    )}
                    <Stack.Screen
                        name="TransactionHistory"
                        component={TransactionHistory}
                        options={{
                            headerBackTitle: "Back",
                            title: "Order History"
                        }}
                    />
                    <Stack.Screen
                        name="Cart"
                        component={CartScreen}
                        options={{
                            headerBackTitle: "Back",
                        }}
                    />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetail}
                        options={({ navigation }) => ({
                            headerBackTitle: "Back",
                            headerRight: () => <CartIcon navigation={navigation} />,
                        })}
                    />
                    <Stack.Screen
                        name="Post"
                        component={Post}
                        options={{
                            headerBackTitle: "Back",
                            headerRight: () => <HeadrMenu />,
                        }}
                    />
                    <Stack.Screen
                        name="About"
                        component={About}
                        options={{
                            headerBackTitle: "Back",
                            headerRight: () => <HeadrMenu />,
                        }}
                    />
                    <Stack.Screen
                        name="Account"
                        component={Account}
                        options={{
                            headerBackTitle: "Back",
                            headerRight: () => <HeadrMenu />,
                        }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

export default ScreeMenu;

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    cartIconContainer: {
        marginRight: 15,
        position: "relative",
    },
    badge: {
        position: "absolute",
        right: -6,
        top: -6,
        backgroundColor: "#6200ea",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
        paddingHorizontal: 4,
    },
});
