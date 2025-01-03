const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Please login to access this route",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token format. Please login to access this route.",
      });
    }

  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Token has expired. Please login again.",
        });
      }
      return res.status(401).json({
        status: "error",
        message: "Invalid token. Please login again.",
      });
    }

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User does not exist. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred. Please try again.",
    });
  }
};

module.exports = authMiddleware;
