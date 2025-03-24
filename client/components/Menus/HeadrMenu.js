import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeadrMenu = () => {
    const [state, setState] = useContext(AuthContext);
    //logout
    const handleLogout = async () => {
        setState({ token: "", user: null });
        await AsyncStorage.removeItem("@auth");
        alert("Logout successful");
    };
    return (
        <View>
            <TouchableOpacity onPress={handleLogout}>
                <FontAwesome5
                    name="sign-out-alt"
                    style={styles.iconStyle}
                    color={"red"}
                />
                {/* <Text>Home</Text> */}
            </TouchableOpacity>
        </View>
    );
};

export default HeadrMenu;

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
