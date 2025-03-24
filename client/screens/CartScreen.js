import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { useCart } from '../context/cartContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FooterMenu from '../components/Menus/FooterMenu';
import axios from 'axios';

const CartScreen = ({ navigation }) => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const handleQuantityChange = (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            Alert.alert(
                "Remove Item",
                "Do you want to remove this item from cart?",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Remove",
                        onPress: () => removeFromCart(productId)
                    }
                ]
            );
            return;
        }
        updateQuantity(productId, newQuantity);
    };

    const handleCheckout = async () => {
        if (cart.items.length === 0) {
            Alert.alert("Cart Empty", "Please add items to cart before checkout");
            return;
        }

        try {
            // Create transaction object
            const transaction = {
                items: cart.items.map(item => ({
                    productId: item._id,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price,
                    thumbnail: item.thumbnail
                })),
                totalAmount: cart.total,
                paymentMethod: "Credit Card", // You can add payment method selection
                shippingAddress: {
                    street: "123 Main St", // You can add address form
                    city: "City",
                    state: "State",
                    zipCode: "12345",
                    country: "Country"
                }
            };

            const { data } = await axios.post("/transactions/create", transaction);

            if (data.success) {
                Alert.alert(
                    "Success",
                    "Order placed successfully!",
                    [
                        {
                            text: "View Order",
                            onPress: () => {
                                clearCart();
                                navigation.navigate("TransactionHistory");
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.error("Checkout error:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    };

    const handleClearCart = () => {
        Alert.alert(
            "Clear Cart",
            "Are you sure you want to remove all items from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear",
                    onPress: clearCart,
                    style: "destructive"
                }
            ]
        );
    };

    const renderCartItem = ({ item }) => {
        const itemTotal = item.price * item.quantity;

        return (
            <View style={styles.cartItem}>
                <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                    <Text style={styles.itemPrice}>${itemTotal.toFixed(2)}</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item._id, item.quantity, -1)}
                            style={styles.quantityButton}
                        >
                            <Icon name="remove" size={24} color="#6200ea" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item._id, item.quantity, 1)}
                            style={styles.quantityButton}
                        >
                            <Icon name="add" size={24} color="#6200ea" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Remove Item",
                            "Are you sure you want to remove this item?",
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel"
                                },
                                {
                                    text: "Remove",
                                    onPress: () => removeFromCart(item._id),
                                    style: "destructive"
                                }
                            ]
                        );
                    }}
                    style={styles.removeButton}
                >
                    <Icon name="delete" size={24} color="#f44336" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
                {cart.items.length > 0 && (
                    <TouchableOpacity onPress={handleClearCart}>
                        <Icon name="delete-sweep" size={24} color="#f44336" />
                    </TouchableOpacity>
                )}
            </View>

            {cart.items.length === 0 ? (
                <View style={styles.emptyCart}>
                    <Icon name="shopping-cart" size={64} color="#ccc" />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart.items}
                        renderItem={renderCartItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.cartList}
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Total:</Text>
                            <Text style={styles.totalAmount}>${cart.total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={handleCheckout}
                        >
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            <FooterMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartList: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemBrand: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        color: '#6200ea',
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        padding: 4,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    removeButton: {
        padding: 4,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        elevation: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    checkoutButton: {
        backgroundColor: '#6200ea',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#6200ea',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen; 