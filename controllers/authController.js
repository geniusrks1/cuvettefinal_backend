const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
const formatResponse = (status, message, data = null) => ({ status, message, data });
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new user
    const user = await User.create({ name, email, password });
    // res.status(201).json({ token: generateToken(user._id) });
    res.status(201).json(formatResponse("success", "User registered successfully", { user }));
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(formatResponse("error", "Email and Password are required"));
  }
  try {
   
 
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
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, newPassword, oldPassword, email } = req.body;
    let updateFields = {};

    // Handle password update
    if (newPassword || oldPassword) {
      // Ensure both oldPassword and newPassword are provided
      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json(
            formatResponse(
              "error",
              "Both old password and new password are required to update your password"
            )
          );
      }

      // Verify oldPassword
      const user = await User.findById(req.user._id).select("+password");
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).json(formatResponse("error", "Old password is incorrect"));
      }

      // Hash and add newPassword to updateFields
      updateFields.password = await bcrypt.hash(newPassword, 12);
    }

    // Handle email update
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
        return res.status(400).json(formatResponse("error", "Email already in use"));
      }
      updateFields.email = email;
    }

    // Handle name update
    if (name) {
      updateFields.name = name;
    }

    // If no fields to update
    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json(formatResponse("error", "No valid fields provided to update"));
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json(formatResponse("success", "User updated successfully", { user: updatedUser }));
  } catch (error) {
    res.status(500).json(formatResponse("error", error.message));
  }
};
