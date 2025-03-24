import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "./context/authContext";
import ScreeMenu from "./components/Menus/ScreeMenu";
import { PostContext, PostProvider } from "./context/postContext";

const RootNavigation = () => {
    return (
        <AuthProvider>
            <PostProvider>
                <ScreeMenu />
            </PostProvider>
        </AuthProvider>
    );
};

export default RootNavigation;
