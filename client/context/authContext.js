// Sửa authContext.js
import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Tạo context
const AuthContext = createContext();

// Tạo useAuth hook
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Tạo provider
const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    useEffect(() => {
        const loadLocalStorage = async () => {
            let data = await AsyncStorage.getItem("@auth");
            let loginData = JSON.parse(data);
            setState({
                ...state,
                user: loginData?.user,
                token: loginData?.token,
            });
        };
        loadLocalStorage();
    }, []);

    let token = state && state.token;
    //default axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.baseURL = "http://10.33.68.159:3001/api";

    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};

// Export riêng
export { AuthContext, AuthProvider, useAuth };
