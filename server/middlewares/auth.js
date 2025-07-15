const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth Middleware
exports.auth = async (req, res, next) => {
  try {
    // Extract the token from cookies, body, or headers
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is missing, return a response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing.",
      });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);
      req.user = decoded; // Attach user details to the request object
    } catch (error) {
      if(error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token is invalid.",
      });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token.",
      error: error.message,
    });
  }
};

// Student Role Middleware
exports.isStudent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User details not found.",
      });
    }

    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for students only.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified. Please try again later.",
      error: error.message,
    });
  }
};

// Instructor Role Middleware
exports.isInstructor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User details not found.",
      });
    }

    const userDetails = await User.findById(req.user.id);

    if (!userDetails || userDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for instructors only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified. Please try again later.",
      error: error.message,
    });
  }
};

// Admin Role Middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User details not found.",
      });
    }

    const userDetails = await User.findById(req.user.id);

    if (!userDetails || userDetails.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route for admins only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified. Please try again later.",
      error: error.message,
    });
  }
};
