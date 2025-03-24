import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
const FooterMenu = () => {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <FontAwesome5
                    name="home"
                    style={styles.iconStyle}
                    color={route.name === "Home" && "orange"}
                />
                <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <FontAwesome5
                    name="shopping-cart"
                    style={styles.iconStyle}
                    color={route.name === "Cart" && "orange"}
                />
                <Text>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("About")}>
                <FontAwesome5
                    name="info-circle"
                    style={styles.iconStyle}
                    color={route.name === "About" && "orange"}
                />
                <Text>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
                <FontAwesome5
                    name="user"
                    style={styles.iconStyle}
                    color={route.name === "Account" && "orange"}
                />
                <Text>Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FooterMenu;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: 10,
        justifyContent: "space-between",
    },
    iconStyle: {
        marginBottom: 3,
        alignSelf: "center",
        fontSize: 20,
    },
});
