// src/controllers/authController.js
const AuthService = require("../auth/authService");
const AuthValidation = require("../auth/authValiadation");
const ResponseHandler = require("../utils/responseHandler");

class AuthController {
  // Register User
  async register(req, res) {
    try {
      // Validasi input
      const { error } = AuthValidation.registerValidation(req.body);
      if (error) {
        return ResponseHandler.validationError(res, error.details);
      }

      // Proses registrasi
      const user = await AuthService.register(req.body);

      ResponseHandler.success(res, 201, "User registered successfully", user);
    } catch (error) {
      if (error.message === "Email already exists") {
        return ResponseHandler.error(res, 409, error.message);
      }
      ResponseHandler.error(res, 500, "Registration failed", error.message);
    }
  }

  // Login User
  async login(req, res) {
    try {
      // Validasi input
      const { error } = AuthValidation.loginValidation(req.body);
      if (error) {
        return ResponseHandler.validationError(res, error.details);
      }

      // Proses login
      const { user, token } = await AuthService.login(req.body);

      ResponseHandler.success(res, 200, "Login successful", { user, token });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return ResponseHandler.error(res, 401, error.message);
      }
      ResponseHandler.error(res, 500, "Login failed", error.message);
    }
  }

  // Get User Profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const profile = await AuthService.getUserProfile(userId);

      ResponseHandler.success(
        res,
        200,
        "Profile retrieved successfully",
        profile
      );
    } catch (error) {
      ResponseHandler.error(
        res,
        500,
        "Failed to retrieve profile",
        error.message
      );
    }
  }
}

module.exports = new AuthController();
