const prisma = require("../db");

class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(userData) {
    return await prisma.user.create({
      data: userData,
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

module.exports = new UserRepository();
