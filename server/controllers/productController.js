const Product = require('../models/productModel');
const User = require('../models/userModel');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Get all products with filtering, sorting, and pagination
const getProducts = async (req, res) => {
    try {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            page = 1,
            limit = 10
        } = req.query;

        // Build filter object
        const filter = {};
        if (category) {
            // Case-insensitive category search
            filter.category = new RegExp(category, 'i');
        }
        if (brand) {
            // Case-insensitive brand search
            filter.brand = new RegExp(brand, 'i');
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'priceAsc':
                sort.price = 1;
                break;
            case 'priceDesc':
                sort.price = -1;
                break;
            case 'rating':
                sort.rating = -1;
                break;
            case 'newest':
                sort.createdAt = -1;
                break;
            default:
                sort.createdAt = -1;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            products,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Add a review to a product
const addReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const review = {
            rating: req.body.rating,
            comment: req.body.comment,
            reviewerName: req.body.reviewerName,
            reviewerEmail: req.body.reviewerEmail,
            date: new Date()
        };

        product.reviews.push(review);

        // Update product rating
        const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
        product.rating = totalRating / product.reviews.length;

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Review added successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

// Add review
const handleReview = async (req, res) => {
    try {
        const { rating, comment, reviewerName } = req.body;
        const productId = req.params.productId;

        // Validate input
        if (!rating || !comment || !reviewerName) {
            return res.status(400).json({
                success: false,
                message: "Rating, comment, and reviewer name are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Create new review
        const reviewData = {
            rating,
            comment,
            reviewerName,
            date: new Date()
        };

        // Add new review
        product.reviews.push(reviewData);

        // Update product rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
            product.rating = (totalRating / product.reviews.length).toFixed(1);
        }

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error in handleReview: ", error);
        res.status(500).json({
            success: false,
            message: "Error in handling review",
            error: error.message
        });
    }
};

// Get reviews for a product
const getUserReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const {
            page = 1,
            limit = 3,
            sortBy = 'date',
            order = 'desc',
            rating
        } = req.query;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let filteredReviews = [...product.reviews];

        // Filter by rating if specified
        if (rating) {
            filteredReviews = filteredReviews.filter(review => review.rating === parseInt(rating));
        }

        // Sort reviews
        filteredReviews.sort((a, b) => {
            if (sortBy === 'date') {
                return order === 'desc'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date);
            }
            if (sortBy === 'rating') {
                return order === 'desc'
                    ? b.rating - a.rating
                    : a.rating - b.rating;
            }
            return 0;
        });

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        res.status(200).json({
            success: true,
            reviews: paginatedReviews,
            totalReviews: filteredReviews.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredReviews.length / limit),
            hasMore: endIndex < filteredReviews.length
        });
    } catch (error) {
        console.error("Error in getUserReview: ", error);
        res.status(500).json({
            success: false,
            message: "Error in getting reviews",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addReview,
    handleReview,
    getUserReview
}; 