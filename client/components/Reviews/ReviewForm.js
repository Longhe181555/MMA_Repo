import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [existingReview, setExistingReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserReview();
    }, [productId]);

    const fetchUserReview = async () => {
        try {
            const { data } = await axios.get(`/products/${productId}/user-review`);
            if (data.review) {
                setExistingReview(data.review);
                setRating(data.review.rating);
                setComment(data.review.comment);
            }
        } catch (error) {
            console.error('Error fetching user review:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (rating === 0) {
                Alert.alert('Error', 'Please select a rating');
                return;
            }
            if (!comment.trim()) {
                Alert.alert('Error', 'Please enter a comment');
                return;
            }
            if (!reviewerName.trim()) {
                Alert.alert('Error', 'Please enter your name');
                return;
            }

            setLoading(true);
            const { data } = await axios.post(`/products/${productId}/review`, {
                rating,
                comment,
                reviewerName
            });

            Alert.alert(
                'Success',
                existingReview ? 'Review updated successfully' : 'Review added successfully'
            );

            if (onReviewSubmitted) {
                onReviewSubmitted(data.product);
            }

            setExistingReview(data.review);
            setRating(0);
            setComment('');
            setReviewerName('');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Error submitting review');
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {existingReview ? 'Update Your Review' : 'Write a Review'}
            </Text>

            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                    >
                        <Icon
                            name={star <= rating ? 'star' : 'star-border'}
                            size={32}
                            color={star <= rating ? '#FFD700' : '#666'}
                            style={styles.star}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.nameInput}
                placeholder="Your Name"
                value={reviewerName}
                onChangeText={setReviewerName}
            />

            <TextInput
                style={styles.commentInput}
                placeholder="Write your review here..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Text>
            </TouchableOpacity>

            {existingReview?.edited && (
                <Text style={styles.editedText}>
                    (Edited)
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    star: {
        marginHorizontal: 5,
    },
    nameInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        marginBottom: 15,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#6200ea',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#9e9e9e',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editedText: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
        fontStyle: 'italic',
    },
});

export default ReviewForm; 