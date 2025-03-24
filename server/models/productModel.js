const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    reviewerName: {
        type: String,
        required: true
    },
    reviewerEmail: String,
    edited: {
        type: Boolean,
        default: false
    }
});

const dimensionsSchema = new mongoose.Schema({
    width: Number,
    height: Number,
    depth: Number
});

const metaSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    barcode: String,
    qrCode: String
});

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    tags: [String],
    brand: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    weight: Number,
    dimensions: dimensionsSchema,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    reviews: [reviewSchema],
    returnPolicy: String,
    minimumOrderQuantity: {
        type: Number,
        default: 1
    },
    meta: metaSchema,
    images: [String],
    thumbnail: String
}, { timestamps: true });

// Update meta.updatedAt before saving
productSchema.pre('save', function (next) {
    this.meta.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Product', productSchema); 