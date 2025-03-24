import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useAuth } from '../context/authContext';
import FooterMenu from '../components/Menus/FooterMenu';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, transactionsRes] = await Promise.all([
                axios.get('/transactions/admin/stats'),
                axios.get('/transactions/admin/all')
            ]);

            setStats(statsRes.data.stats);
            setTransactions(transactionsRes.data.transactions);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            Alert.alert('Error', 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const updateStatus = async (transactionId, newStatus) => {
        try {
            await axios.put(`/transactions/admin/status/${transactionId}`, {
                status: newStatus
            });
            fetchData(); // Refresh data after update
            Alert.alert('Success', 'Order status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            {/* <Icon name={icon} size={24} color={color} /> */}
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
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
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                </View>

                {stats && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <StatCard
                                title="Total Revenue"
                                value={`$${stats.total.revenue.toFixed(2)}`}
                                icon="attach-money"
                                color="#4CAF50"
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats.total.orders}
                                icon="shopping-cart"
                                color="#2196F3"
                            />
                        </View>
                        <View style={styles.statsRow}>
                            <StatCard
                                title="Completed"
                                value={stats.total.completed}
                                icon="check-circle"
                                color="#4CAF50"
                            />
                            <StatCard
                                title="Cancelled"
                                value={stats.total.cancelled}
                                icon="cancel"
                                color="#F44336"
                            />
                        </View>
                        <View style={styles.growthContainer}>
                            <Text style={styles.growthTitle}>Monthly Growth</Text>
                            <View style={styles.growthStats}>
                                <Text style={styles.growthText}>
                                    Revenue:
                                    <Text style={[
                                        styles.growthValue,
                                        { color: stats.revenueGrowth >= 0 ? '#4CAF50' : '#F44336' }
                                    ]}>
                                        {` ${stats.revenueGrowth.toFixed(1)}%`}
                                    </Text>
                                </Text>
                                <Text style={styles.growthText}>
                                    Orders:
                                    <Text style={[
                                        styles.growthValue,
                                        { color: stats.ordersGrowth >= 0 ? '#4CAF50' : '#F44336' }
                                    ]}>
                                        {` ${stats.ordersGrowth.toFixed(1)}%`}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Orders</Text>
                    {transactions.map((transaction) => (
                        <View key={transaction._id} style={styles.orderCard}>
                            <View style={styles.orderHeader}>
                                <Text style={styles.orderId}>
                                    Order #{transaction._id.slice(-6)}
                                </Text>
                                <Text style={styles.orderDate}>
                                    {moment(transaction.createdAt).format('MMM DD, YYYY')}
                                </Text>
                            </View>

                            <View style={styles.customerInfo}>
                                <Icon name="person" size={16} color="#666" />
                                <Text style={styles.customerText}>
                                    {transaction.user ?
                                        `${transaction.user.name} (${transaction.user.email})` :
                                        'User information unavailable'}
                                </Text>
                            </View>

                            <View style={styles.orderDetails}>
                                <Text style={styles.orderAmount}>
                                    ${transaction.totalAmount.toFixed(2)}
                                </Text>
                                <Text style={styles.itemCount}>
                                    {transaction.items.length} items
                                </Text>
                            </View>

                            <View style={styles.statusContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.statusButton,
                                        { backgroundColor: transaction.status === 'completed' ? '#4CAF50' : '#e0e0e0' }
                                    ]}
                                    onPress={() => updateStatus(transaction._id, 'completed')}
                                >
                                    <Text style={styles.statusButtonText}>Complete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.statusButton,
                                        { backgroundColor: transaction.status === 'cancelled' ? '#F44336' : '#e0e0e0' }
                                    ]}
                                    onPress={() => updateStatus(transaction._id, 'cancelled')}
                                >
                                    <Text style={styles.statusButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
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
        backgroundColor: '#6200ea',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 8,
        borderLeftWidth: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    statTitle: {
        color: '#666',
    },
    growthContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 8,
        marginTop: 8,
    },
    growthTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    growthStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    growthText: {
        fontSize: 14,
    },
    growthValue: {
        fontWeight: 'bold',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontWeight: 'bold',
    },
    orderDate: {
        color: '#666',
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    customerText: {
        marginLeft: 8,
        color: '#666',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    itemCount: {
        color: '#666',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    statusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AdminDashboard; 