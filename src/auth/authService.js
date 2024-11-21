const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../auth/authRepository");

class AuthService {
  // Generate JWT Token
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );
  }

  // Register User
  async register(userData) {
    const { name, email, password } = userData;

    // Cek apakah email sudah terdaftar
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user baru
    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // default role
    });

    // Hapus password dari response
    delete newUser.password;
    return newUser;
  }

  // Login User
  async login(loginData) {
    const { email, password } = loginData;

    // Cari user berdasarkan email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken(user);

    // Hapus password dari user object
    delete user.password;

    return {
      user,
      token,
    };
  }

  // Get User Profile
  async getUserProfile(userId) {
    return await UserRepository.findById(userId);
  }
}

module.exports = new AuthService();
