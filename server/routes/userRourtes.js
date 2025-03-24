const express = require("express");
const {
    registerController,
    loginController,
    updateUserController,
    requireSingIn,
} = require("../controllers/userController");
//riouter obj
const router = express.Router();

//register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//update
router.put("/update-user", requireSingIn, updateUserController);

//export
module.exports = router;
