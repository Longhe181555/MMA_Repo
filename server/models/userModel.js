const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add email address"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please add password"],
            min: 6,
            max: 64,
        },
        role: {
            type: String,
            default: "user",
        },
        cart: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            title: String,
            price: Number,
            thumbnail: String
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
