const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

// Create new transaction
const createTransaction = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        const transaction = new Transaction({
            user: req.auth._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction
        });
    } catch (error) {
        console.error("Error in createTransaction: ", error);
        res.status(500).json({
            success: false,
            message: "Error in creating transaction",
            error: error.message
        });
    }
};

// Get user's transaction history
const getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.auth._id })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error("Error in getTransactionHistory: ", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching transaction history",
            error: error.message
        });
    }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.auth._id
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        console.error("Error in getTransactionById: ", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching transaction",
            error: error.message
        });
    }
};

// Admin: Get all transactions with user details
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Calculate total revenue
        const totalRevenue = transactions.reduce((sum, transaction) => {
            if (transaction.status === 'completed') {
                return sum + transaction.totalAmount;
            }
            return sum;
        }, 0);

        // Get statistics
        const stats = {
            totalOrders: transactions.length,
            completedOrders: transactions.filter(t => t.status === 'completed').length,
            pendingOrders: transactions.filter(t => t.status === 'pending').length,
            cancelledOrders: transactions.filter(t => t.status === 'cancelled').length,
            totalRevenue: totalRevenue,
            averageOrderValue: totalRevenue / transactions.filter(t => t.status === 'completed').length || 0
        };

        res.status(200).json({
            success: true,
            stats,
            transactions
        });
    } catch (error) {
        console.error("Error in getAllTransactions: ", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching transactions",
            error: error.message
        });
    }
};

// Admin: Update transaction status
const updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction status updated successfully",
            transaction
        });
    } catch (error) {
        console.error("Error in updateTransactionStatus: ", error);
        res.status(500).json({
            success: false,
            message: "Error in updating transaction status",
            error: error.message
        });
    }
};

// Admin: Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        // Get all transactions
        const allTransactions = await Transaction.find();

        // Get this month's transactions
        const thisMonthTransactions = allTransactions.filter(t =>
            new Date(t.createdAt) >= thisMonth
        );

        // Get last month's transactions
        const lastMonthTransactions = allTransactions.filter(t =>
            new Date(t.createdAt) >= lastMonth && new Date(t.createdAt) < thisMonth
        );

        // Calculate statistics
        const stats = {
            total: {
                revenue: allTransactions.reduce((sum, t) => t.status === 'completed' ? sum + t.totalAmount : sum, 0),
                orders: allTransactions.length,
                completed: allTransactions.filter(t => t.status === 'completed').length,
                cancelled: allTransactions.filter(t => t.status === 'cancelled').length
            },
            thisMonth: {
                revenue: thisMonthTransactions.reduce((sum, t) => t.status === 'completed' ? sum + t.totalAmount : sum, 0),
                orders: thisMonthTransactions.length
            },
            lastMonth: {
                revenue: lastMonthTransactions.reduce((sum, t) => t.status === 'completed' ? sum + t.totalAmount : sum, 0),
                orders: lastMonthTransactions.length
            },
            revenueGrowth: 0,
            ordersGrowth: 0
        };

        // Calculate growth percentages
        if (lastMonthTransactions.length > 0) {
            stats.revenueGrowth = ((stats.thisMonth.revenue - stats.lastMonth.revenue) / stats.lastMonth.revenue) * 100;
            stats.ordersGrowth = ((stats.thisMonth.orders - stats.lastMonth.orders) / stats.lastMonth.orders) * 100;
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error("Error in getDashboardStats: ", error);
        res.status(500).json({
            success: false,
            message: "Error in fetching dashboard statistics",
            error: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactionHistory,
    getTransactionById,
    getAllTransactions,
    updateTransactionStatus,
    getDashboardStats
}; 