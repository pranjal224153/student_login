const express = require("express");
const router = express.Router();
const {
    register,
    login,
    updatePassword,
    updateCourse
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.put("/update-password", authMiddleware, updatePassword);
router.put("/update-course", authMiddleware, updateCourse);

module.exports = router;