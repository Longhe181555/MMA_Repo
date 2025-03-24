import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Tạo context
const PostContext = createContext();

// Tạo provider
const PostProvider = ({ children }) => {
    //state
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    //get posts
    const getAllPosts = async() =>{
        setLoading(true);
        try {
            const {data} = await axios.get('/post/get-all-posts')
            setLoading(false);
            setPosts(data?.posts)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    //inintal posts
    useEffect(() => {
        getAllPosts();
    }, []);

    // let token = state && state.token;
    // //default axios
    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // axios.defaults.baseURL = "http://192.168.1.10:3001/api";

    return (
        <PostContext.Provider value={[posts, setPosts]}>
            {children}
        </PostContext.Provider>
    );
};

// Export riêng
export { PostContext, PostProvider };
