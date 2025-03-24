import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Cart Context
const CartContext = createContext();

// Initial state for cart
const initialState = {
    items: [],
    total: 0
};

// Cart reducer to handle all cart actions
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.items.findIndex(
                item => item._id === action.payload._id
            );

            if (existingItemIndex > -1) {
                // If item exists, update quantity
                const updatedItems = state.items.map((item, index) => {
                    if (index === existingItemIndex) {
                        return {
                            ...item,
                            quantity: item.quantity + (action.payload.quantity || 1)
                        };
                    }
                    return item;
                });

                return {
                    ...state,
                    items: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
            }

            // If item doesn't exist, add new item
            const newItem = {
                ...action.payload,
                quantity: action.payload.quantity || 1
            };

            return {
                ...state,
                items: [...state.items, newItem],
                total: state.total + (newItem.price * newItem.quantity)
            };

        case 'REMOVE_FROM_CART':
            const filteredItems = state.items.filter(item => item._id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

        case 'UPDATE_QUANTITY':
            const updatedItems = state.items.map(item => {
                if (item._id === action.payload.id) {
                    return {
                        ...item,
                        quantity: action.payload.quantity
                    };
                }
                return item;
            });

            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };

        case 'CLEAR_CART':
            return initialState;

        case 'LOAD_CART':
            return action.payload;

        default:
            return state;
    }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from AsyncStorage on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('@cart');
                if (savedCart) {
                    dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };
        loadCart();
    }, []);

    // Save cart to AsyncStorage whenever it changes
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('@cart', JSON.stringify(state));
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        };
        saveCart();
    }, [state]);

    // Cart actions
    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const removeFromCart = (productId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{
            cart: state,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 