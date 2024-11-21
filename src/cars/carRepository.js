// src/repositories/carRepository.js
const prisma = require("../db/index");

class CarRepository {
  async findAll() {
    return await prisma.cars.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  async findById(id) {
    return await prisma.cars.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return await prisma.cars.create({
      data,
    });
  }

  async update(id, data) {
    return await prisma.cars.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.cars.delete({
      where: { id },
    });
  }
}

module.exports = new CarRepository();
