import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const PaymentVerificationScreen = ({ route }) => {
    const navigation = useNavigation();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { transactionId, vnp_ResponseCode, vnp_Amount } = route.params;

                const { data } = await axios.get('/transactions/payment/vnpay/verify', {
                    params: {
                        transactionId,
                        vnp_ResponseCode,
                        vnp_Amount
                    }
                });

                if (data.success) {
                    alert('Payment successful!');
                } else {
                    alert('Payment failed!');
                }

                // Navigate back to transaction history
                navigation.replace('TransactionHistory');
            } catch (error) {
                console.error('Payment verification error:', error);
                alert('Error verifying payment');
                navigation.replace('TransactionHistory');
            }
        };

        verifyPayment();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6200ea" />
            <Text style={styles.text}>Verifying payment...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
    }
});

export default PaymentVerificationScreen; 