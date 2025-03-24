const express = require("express");
const { requireSingIn } = require("../controllers/userController");
const {
    createTransaction,
    getTransactionHistory,
    getTransactionById,
    getAllTransactions,
    updateTransactionStatus,
    getDashboardStats
} = require("../controllers/transactionController");

// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        if (req.auth?.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            error,
            message: "Error in admin middleware",
        });
    }
};

const router = express.Router();

// User routes
router.post("/create", requireSingIn, createTransaction);
router.get("/history", requireSingIn, getTransactionHistory);
router.get("/:id", requireSingIn, getTransactionById);

// Admin routes
router.get("/admin/all", requireSingIn, isAdmin, getAllTransactions);
router.get("/admin/stats", requireSingIn, isAdmin, getDashboardStats);
router.put("/admin/status/:id", requireSingIn, isAdmin, updateTransactionStatus);

module.exports = router; 