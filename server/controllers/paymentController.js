const { createPaymentLinkAD } = require('../helpers/utils');
const Transaction = require('../models/transactionModel');

const createVNPayment = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        // Convert ObjectId to string before using slice
        const orderId = transaction._id.toString().slice(-6);

        const paymentUrl = createPaymentLinkAD(
            transaction.totalAmount,
            `Thanh toan don hang ${orderId}`.replace(/[^a-zA-Z0-9 ]/g, ''),
            req.ip || '127.0.0.1',
            transaction._id.toString()  // This will be transactionID in the VNPay params
        );

        res.status(200).json({
            success: true,
            paymentUrl
        });
    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message
        });
    }
};

const verifyVNPayment = async (req, res) => {
    try {
        const { transactionId, vnp_ResponseCode, vnp_Amount } = req.query;

        if (vnp_ResponseCode === "00") {
            // Payment successful
            await Transaction.findByIdAndUpdate(transactionId, {
                status: "completed",
                paymentStatus: "paid",
                paidAmount: parseInt(vnp_Amount) / 100
            });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            // Payment failed
            await Transaction.findByIdAndUpdate(transactionId, {
                status: "cancelled",
                paymentStatus: "failed"
            });

            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment",
            error: error.message
        });
    }
};

module.exports = {
    createVNPayment,
    verifyVNPayment
}; 