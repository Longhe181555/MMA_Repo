const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            title: String,
            quantity: Number,
            price: Number,
            thumbnail: String
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        },
        shippingAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        paymentMethod: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema); 