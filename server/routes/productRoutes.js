const express = require('express');
const { requireSingIn } = require('../controllers/userController');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    handleReview,
    getUserReview
} = require('../controllers/productController');

const router = express.Router();

// Product routes
router.post('/create', requireSingIn, createProduct);
router.get('/all', getProducts);
router.post('/:productId/review', requireSingIn, handleReview);
router.get('/:productId/user-review', requireSingIn, getUserReview);

router.get('/:id', getProductById);
router.put('/:id', requireSingIn, updateProduct);
router.delete('/:id', requireSingIn, deleteProduct);

// Review routes

module.exports = router; 