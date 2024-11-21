// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../auth/authContorller");
const AuthMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected Routes
router.get("/profile", AuthMiddleware.authenticate, AuthController.getProfile);

module.exports = router;
