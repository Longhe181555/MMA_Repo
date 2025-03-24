import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import FooterMenu from "../components/Menus/FooterMenu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import { PostContext } from "../context/postContext";

const Post = ({ navigation }) => {
    //global state
    const [posts, setPosts] = useContext(PostContext);
    //local state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    //handle submit post
    const handleSubmitPost = async () => {
        try {
            setLoading(true);
            if (!title) {
                alert("Please add post title ");
                return;
            }
            if (!description) {
                alert("Please add post description ");
                return;
            }
            const { data } = await axios.post("/post/create-post", {
                title,
                description,
            });
            setLoading(false);
            setPosts([...posts, data?.post]);
            alert(data?.message);
            navigation.navigate("Home");
        } catch (error) {
            alert(error.response.data.message || error.message);
            setLoading(false);
            console.log("error: ", error);
        }
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.heading}>Create a post</Text>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="Add post title"
                        placeholderTextColor={"gray"}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <TextInput
                        style={[styles.inputBox, styles.textArea]}
                        placeholder="Add post description"
                        placeholderTextColor={"gray"}
                        multiline={true}
                        numberOfLines={6}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.postBtn}
                        onPress={handleSubmitPost}
                    >
                        <Text style={styles.postBtnText}>
                            <FontAwesome5 name="plus-square" size={18} />
                            {"  "}
                            Create post
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <FooterMenu />
            </View>
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 20,
        paddingTop: 50,
    },
    content: {
        alignItems: "center",
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#333",
        marginBottom: 20,
    },
    inputBox: {
        backgroundColor: "#fff",
        width: "100%",
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    buttonContainer: {
        alignItems: "center",
    },
    postBtn: {
        backgroundColor: "#007bff",
        width: "100%",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    postBtnText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
    },
});
