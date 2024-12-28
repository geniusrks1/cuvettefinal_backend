const express = require("express");
const { register, login, getUser, updateUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Registration
router.post("/register", register);

// Login
router.post("/login", login);

// Get current user
router.get("/", authMiddleware, getUser);

// Update user details
router.patch("/", authMiddleware, updateUser);

module.exports = router;
