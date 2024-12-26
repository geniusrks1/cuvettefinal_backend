const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const protectedMiddleware = require("../middleware/auth");
const { User } = require("../schema/user.schema");

dotenv.config();

// Utility function for responses
const formatResponse = (status, message, data = null) => ({ status, message, data });

// Register Route
router.post("/register", async (req, res) => {
  try {
   
    const { email, name, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json(formatResponse("error", "All fields are required"));
    }

    if (password !== confirmPassword) {
      return res.status(400).json(formatResponse("error", "Passwords do not match"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(formatResponse("error", "Email already exists"));
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    res.status(201).json(formatResponse("success", "User registered successfully", { user }));
  } catch (err) {
    res.status(500).json(formatResponse("error", err.message));
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(formatResponse("error", "Email and Password are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json(formatResponse("error", "Email not registered"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json(formatResponse("error", "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json(
      formatResponse("success", "Login successful", {
        user: { name: user.name, email: user.email, _id: user._id },
        token,
      })
    );
  } catch (error) {
    res.status(500).json(formatResponse("error", error.message));
  }
});

// Get User Details
router.get("/", protectedMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(formatResponse("error", "User not found"));
    }
    res.status(200).json(formatResponse("success", "User retrieved", { user }));
  } catch (error) {
    res.status(500).json(formatResponse("error", error.message));
  }
});

// Update User Details
router.patch("/", protectedMiddleware, async (req, res) => {
  try {
    const { name, newPassword, oldPassword, email, phoneNumber } = req.body;
    let updateFields = {};

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json(formatResponse("error", "Old password is required to update password"));
      }

      const user = await User.findById(req.user._id).select("+password");
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).json(formatResponse("error", "Old password is incorrect"));
      }

      updateFields.password = await bcrypt.hash(newPassword, 12);
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
        return res.status(400).json(formatResponse("error", "Email already in use"));
      }
      updateFields.email = email;
    }

    if (name) updateFields.name = name;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(formatResponse("success", "User updated successfully", { user: updatedUser }));
  } catch (error) {
    res.status(500).json(formatResponse("error", error.message));
  }
});

module.exports = router;