import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import axios from 'axios';
import FooterMenu from '../components/Menus/FooterMenu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useAuth } from '../context/authContext';

const TransactionHistory = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [auth] = useAuth();

    const fetchTransactions = async () => {
        try {
            const { data } = await axios.get('/transactions/history');
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Error fetching transaction history');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#4CAF50';
            case 'pending':
                return '#FFC107';
            case 'cancelled':
                return '#F44336';
            default:
                return '#666';
        }
    };

    const renderTransaction = ({ item }) => (
        <TouchableOpacity
            style={styles.transactionCard}
            onPress={() => navigation.navigate('TransactionDetail', { transactionId: item._id })}
        >
            <View style={styles.transactionHeader}>
                <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
                <Text
                    style={[
                        styles.status,
                        { color: getStatusColor(item.status) }
                    ]}
                >
                    {item.status.toUpperCase()}
                </Text>
            </View>

            <View style={styles.transactionInfo}>
                <View style={styles.infoRow}>
                    <Icon name="event" size={16} color="#666" />
                    <Text style={styles.infoText}>
                        {moment(item.createdAt).format('MMM DD, YYYY, h:mm A')}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="shopping-bag" size={16} color="#666" />
                    <Text style={styles.infoText}>
                        {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="attach-money" size={16} color="#666" />
                    <Text style={styles.amount}>
                        ${item.totalAmount.toFixed(2)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ea" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transaction History</Text>
            </View>

            {transactions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="receipt-long" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No transactions yet</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderTransaction}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#6200ea']}
                        />
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    transactionCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    transactionInfo: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        color: '#666',
        fontSize: 14,
    },
    amount: {
        color: '#6200ea',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
    },
});

export default TransactionHistory; 