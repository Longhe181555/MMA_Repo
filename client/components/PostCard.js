import { StyleSheet, Text, View } from "react-native";
import React from "react";
import moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";

const PostCard = ({ post }) => {
    return (
        <View>
            <Text style={styles.heading}>Total Posts {post?.length}</Text>
            {post?.map((post, i) => (
                <View style={styles.card} key={i}>
                    <Text style={styles.title} >Title: {post?.title}</Text>
                    <Text style={styles.desc}>Description: {post?.description}</Text>
                    <View style={styles.footer}>
                        <Text>
                            <FontAwesome5 name="user" color={"orange"}/> {" "}
                            {post?.postedBy?.name}
                        </Text>
                        <Text>
                        <FontAwesome5 name="clock" color={"orange"}/> {" "}
                            {moment(post?.createdAt).format("DD/MM/YYYY")}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    heading: {
        color: "green",
        textAlign: "center",
    },
    card: {
        width: "97%",
        backgroundColor: "white",
        borderWidth: 0.2,
        borderColor: "#ccc",
        padding: 20,
        borderRadius: 5,
        marginVertical: 5,
    },
    title: {
        fontWeight: "bold",
        paddingBottom: 8,
        borderBottomWidth: 0.3
    },
    desc:{
        marginTop: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});
