import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCart } from '../context/cartContext';
import ReviewForm from '../components/Reviews/ReviewForm';
import axios from 'axios';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }) => {
    const [productData, setProductData] = useState(route.params.product);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterRating, setFilterRating] = useState(null);

    const fetchReviews = async (pageNum = 1, resetList = false) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/products/${productData._id}/user-review`, {
                params: {
                    page: pageNum,
                    limit: 3,
                    sortBy,
                    order: sortOrder,
                    rating: filterRating
                }
            });

            setReviews(resetList ? data.reviews : [...reviews, ...data.reviews]);
            setHasMore(data.hasMore);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(1, true);
    }, [sortBy, sortOrder, filterRating]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchReviews(page + 1);
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= productData.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (productData.stock > 0) {
            addToCart({ ...productData, quantity });
            alert('Product added to cart!');
            navigation.goBack();
        }
    };

    const calculateDiscountedPrice = () => {
        if (productData.discountPercentage) {
            const originalPrice = productData.price;
            return (originalPrice * (1 - productData.discountPercentage / 100)).toFixed(2);
        }
        return productData.price.toFixed(2);
    };

    const renderSortingControls = () => (
        <View style={styles.filterContainer}>
            <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort by:</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.filterButton, sortBy === 'date' && styles.filterButtonActive]}
                        onPress={() => setSortBy('date')}
                    >
                        <Text style={[styles.filterButtonText, sortBy === 'date' && styles.filterButtonTextActive]}>Date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
                        onPress={() => setSortBy('rating')}
                    >
                        <Text style={[styles.filterButtonText, sortBy === 'rating' && styles.filterButtonTextActive]}>Rating</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Order:</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.filterButton, sortOrder === 'desc' && styles.filterButtonActive]}
                        onPress={() => setSortOrder('desc')}
                    >
                        <Text style={[styles.filterButtonText, sortOrder === 'desc' && styles.filterButtonTextActive]}>Highest First</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, sortOrder === 'asc' && styles.filterButtonActive]}
                        onPress={() => setSortOrder('asc')}
                    >
                        <Text style={[styles.filterButtonText, sortOrder === 'asc' && styles.filterButtonTextActive]}>Lowest First</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Filter by rating:</Text>
                <View style={styles.ratingButtons}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <TouchableOpacity
                            key={rating}
                            style={[styles.ratingButton, filterRating === rating && styles.ratingButtonActive]}
                            onPress={() => setFilterRating(filterRating === rating ? null : rating)}
                        >
                            <Text style={[styles.ratingButtonText, filterRating === rating && styles.ratingButtonTextActive]}>
                                {rating} ★
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
                    handleLoadMore();
                }
            }}
            scrollEventThrottle={400}
        >
            <Image
                source={{ uri: productData.thumbnail }}
                style={styles.image}
                resizeMode="cover"
            />
            {productData.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                        -{Math.round(productData.discountPercentage)}% OFF
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.brand}>{productData.brand}</Text>
                <Text style={styles.title}>{productData.title}</Text>

                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${calculateDiscountedPrice()}</Text>
                    {productData.discountPercentage > 0 && (
                        <Text style={styles.originalPrice}>
                            ${productData.price.toFixed(2)}
                        </Text>
                    )}
                </View>

                <View style={styles.ratingContainer}>
                    <Icon name="star" size={20} color="#FFD700" />
                    <Text style={styles.rating}>{productData.rating.toFixed(1)}</Text>
                    <Text style={styles.stock}>
                        {productData.stock > 0
                            ? `${productData.stock} units in stock`
                            : 'Out of stock'}
                    </Text>
                </View>

                <Text style={styles.description}>{productData.description}</Text>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Category:</Text>
                        <Text style={styles.infoValue}>{productData.category}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>SKU:</Text>
                        <Text style={styles.infoValue}>{productData.sku}</Text>
                    </View>
                    {productData.weight && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Weight:</Text>
                            <Text style={styles.infoValue}>{productData.weight} kg</Text>
                        </View>
                    )}
                    {productData.dimensions && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Dimensions:</Text>
                            <Text style={styles.infoValue}>
                                {`${productData.dimensions.width} × ${productData.dimensions.height} × ${productData.dimensions.depth} cm`}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Shipping & Returns</Text>
                    <Text style={styles.infoText}>{productData.shippingInformation}</Text>
                    <Text style={styles.infoText}>{productData.returnPolicy}</Text>
                </View>

                {productData.warrantyInformation && (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Warranty</Text>
                            <Text style={styles.infoText}>{productData.warrantyInformation}</Text>
                        </View>
                    </>
                )}

                <View style={styles.reviewSection}>
                    <ReviewForm
                        productId={productData._id}
                        onReviewSubmitted={(updatedProduct) => {
                            setProductData(updatedProduct);
                        }}
                    />
                </View>

                <View style={styles.reviewsList}>
                    <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                    {renderSortingControls()}
                    {reviews.length > 0 ? (
                        <>
                            {reviews.map((review, index) => (
                                <View key={index} style={styles.reviewItem}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                                        <View style={styles.ratingContainer}>
                                            {[...Array(5)].map((_, i) => (
                                                <Icon
                                                    key={i}
                                                    name={i < review.rating ? "star" : "star-border"}
                                                    size={16}
                                                    color="#FFD700"
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewDate}>
                                        {new Date(review.date).toLocaleDateString()}
                                        {review.edited && " (Edited)"}
                                    </Text>
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                </View>
                            ))}
                            {loading && (
                                <View style={styles.loadingContainer}>
                                    <Text>Loading more reviews...</Text>
                                </View>
                            )}
                            {!hasMore && reviews.length > 0 && (
                                <Text style={styles.noMoreReviews}>No more reviews</Text>
                            )}
                        </>
                    ) : (
                        <Text style={styles.noReviews}>No reviews yet</Text>
                    )}
                </View>

                {productData.stock > 0 && (
                    <View style={styles.addToCartSection}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                onPress={() => handleQuantityChange(-1)}
                                style={styles.quantityButton}
                            >
                                <Icon name="remove" size={24} color="#6200ea" />
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{quantity}</Text>
                            <TouchableOpacity
                                onPress={() => handleQuantityChange(1)}
                                style={styles.quantityButton}
                            >
                                <Icon name="add" size={24} color="#6200ea" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={handleAddToCart}
                        >
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: width,
        height: width,
    },
    content: {
        padding: 16,
    },
    brand: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    originalPrice: {
        fontSize: 20,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rating: {
        fontSize: 16,
        marginLeft: 4,
        marginRight: 12,
    },
    stock: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    infoSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        width: 100,
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    discountBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#ff3d00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    discountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    reviewSection: {
        marginTop: 20,
        paddingHorizontal: 15,
    },
    reviewsList: {
        padding: 15,
    },
    reviewsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    reviewItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    reviewComment: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    noReviews: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
    addToCartSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    quantityButton: {
        padding: 8,
    },
    quantity: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#6200ea',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterContainer: {
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
    },
    filterSection: {
        marginBottom: 10,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    filterButtonActive: {
        backgroundColor: '#6200ea',
        borderColor: '#6200ea',
    },
    filterButtonText: {
        color: '#666',
        fontSize: 12,
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    ratingButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    ratingButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    ratingButtonActive: {
        backgroundColor: '#6200ea',
        borderColor: '#6200ea',
    },
    ratingButtonText: {
        color: '#666',
        fontSize: 12,
    },
    ratingButtonTextActive: {
        color: '#fff',
    },
    loadingContainer: {
        padding: 10,
        alignItems: 'center',
    },
    noMoreReviews: {
        textAlign: 'center',
        color: '#666',
        padding: 10,
        fontStyle: 'italic',
    },
});

export default ProductDetail; 