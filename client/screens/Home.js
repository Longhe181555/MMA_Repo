import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    RefreshControl
} from "react-native";
import { Searchbar, Chip } from "react-native-paper";
import FooterMenu from "../components/Menus/FooterMenu";
import { useCart } from "../context/cartContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 20;

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState("newest");
    const { addToCart } = useCart();

    const categories = ["All", "Beauty", "Electronics", "Fashion", "Home", "Sports"];
    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Price: Low to High", value: "priceAsc" },
        { label: "Price: High to Low", value: "priceDesc" },
        { label: "Rating", value: "rating" }
    ];

    const fetchProducts = async () => {
        try {
            let url = `/products/all`;
            const params = new URLSearchParams();

            if (sortBy) {
                params.append('sortBy', sortBy);
            }

            if (selectedCategory && selectedCategory !== "All") {
                params.append('category', selectedCategory.toLowerCase());
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                console.error("Error fetching products:", response.data.message);
            }
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleAddToCart = (product) => {
        if (product.stock > 0) {
            addToCart(product);
            alert("Product added to cart!");
        } else {
            alert("Sorry, this product is out of stock!");
        }
    };

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
                {item.discountPercentage > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{Math.round(item.discountPercentage)}%</Text>
                    </View>
                )}
                {item.stock <= 5 && item.stock > 0 && (
                    <View style={styles.lowStockBadge}>
                        <Text style={styles.lowStockText}>Low Stock</Text>
                    </View>
                )}
                {item.stock === 0 && (
                    <View style={[styles.lowStockBadge, styles.outOfStockBadge]}>
                        <Text style={styles.lowStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    {item.discountPercentage > 0 && (
                        <Text style={styles.originalPrice}>
                            ${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                        </Text>
                    )}
                </View>
                <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.addToCartButton,
                        item.stock === 0 && styles.disabledButton
                    ]}
                    onPress={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                >
                    <Text style={styles.addToCartText}>
                        {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search products..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContentContainer}
            >
                {categories.map((category) => (
                    <Chip
                        key={category}
                        selected={selectedCategory === category}
                        onPress={() => setSelectedCategory(category === "All" ? null : category)}
                        style={styles.categoryChip}
                        selectedColor="#6200ea"
                        compact={true}
                        mode="outlined"
                    >
                        {category}
                    </Chip>
                ))}
            </ScrollView>

            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.sortContentContainer}
                >
                    {sortOptions.map((option) => (
                        <Chip
                            key={option.value}
                            selected={sortBy === option.value}
                            onPress={() => setSortBy(option.value)}
                            style={styles.sortChip}
                            selectedColor="#6200ea"
                        >
                            {option.label}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />
            ) : filteredProducts.length === 0 ? (
                <View style={styles.noProductsContainer}>
                    <Icon name="category" size={64} color="#ccc" />
                    <Text style={styles.noProductsText}>
                        {searchQuery
                            ? "No products match your search"
                            : `No products in ${selectedCategory || 'this'} category yet`}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item._id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.productList}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
            <FooterMenu />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    searchBar: {
        margin: 10,
        elevation: 2,
        borderRadius: 10,
    },
    categoriesContainer: {
        maxHeight: 40,
        marginBottom: 8,
    },
    categoriesContentContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    categoryChip: {
        marginRight: 8,
        backgroundColor: '#fff',
        height: 32,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 8,
        height: 40,
    },
    sortContentContainer: {
        alignItems: 'center',
    },
    sortChip: {
        marginRight: 8,
        backgroundColor: '#fff',
        height: 32,
    },
    productList: {
        padding: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        width: cardWidth,
        margin: 8,
        elevation: 3,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: 200,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    cardContent: {
        padding: 12,
    },
    brand: {
        fontSize: 12,
        color: "#666",
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        height: 40,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6200ea",
    },
    originalPrice: {
        fontSize: 14,
        color: "#999",
        textDecorationLine: "line-through",
        marginLeft: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    rating: {
        marginLeft: 4,
        color: "#666",
    },
    discountBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#ff3d00",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    discountText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    lowStockBadge: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "#ff9800",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    outOfStockBadge: {
        backgroundColor: "#f44336",
    },
    lowStockText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    addToCartButton: {
        backgroundColor: "#6200ea",
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    addToCartText: {
        color: "#fff",
        fontWeight: "600",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    sortLabel: {
        marginRight: 10,
        fontSize: 16,
        fontWeight: "500",
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noProductsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
    },
});

export default HomeScreen;
