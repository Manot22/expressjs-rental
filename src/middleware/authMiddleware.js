// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const ResponseHandler = require("../utils/responseHandler");

class AuthMiddleware {
  // Middleware untuk autentikasi
  authenticate(req, res, next) {
    // Ambil token dari header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return ResponseHandler.error(res, 401, "No token provided");
    }

    // Periksa format token (Bearer)
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return ResponseHandler.error(res, 401, "Token error");
    }

    const token = parts[1];

    try {
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tambahkan user ke request
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return ResponseHandler.error(res, 401, "Token expired");
      }
      return ResponseHandler.error(res, 401, "Invalid token");
    }
  }

  // Middleware untuk otorisasi berdasarkan role
  authorize(roles) {
    return (req, res, next) => {
      // Pastikan user sudah terautorisasi
      if (!req.user) {
        return ResponseHandler.error(res, 401, "Unauthorized");
      }

      // Cek apakah role user sesuai
      if (!roles.includes(req.user.role)) {
        return ResponseHandler.error(
          res,
          403,
          "Forbidden: Insufficient permissions"
        );
      }

      next();
    };
  }
}

module.exports = new AuthMiddleware();
