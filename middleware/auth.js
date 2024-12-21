const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require('../schema/user.schema');
dotenv.config();

const protectedMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    console.log(authorization);
    if (!authorization) {
      return res.status(401).json({
        status: 'error',
        message: 'Please login to access this route',
      });
    }

  
    // const temptoken = authorization.split(' ')[1];
    const token = authorization;
    if (!token) {
      console.log(token);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format. Please login to access this route.',
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please login again.',
        });
      }
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please login again.',
      });
    }

    // Find user associated with the decoded ID
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User does not exist. Please login again.',
      });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in protectedMiddleware:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred. Please try again.',
    });
  }
};



module.exports = protectedMiddleware;