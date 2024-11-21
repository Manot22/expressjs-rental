// src/services/carService.js
const CarRepository = require("./carRepository");
const fs = require("fs");
const path = require("path");

const UPLOAD_PATH = path.join(__dirname, "../uploads");
const BASE_URL =
  process.env.BASE_URL ||
  `http://localhost:${process.env.PORT || 2003}/uploads`;

class CarService {
  async getAllCars() {
    const cars = await CarRepository.findAll();
    return cars.map((car) => ({
      ...car,
      image: car.image ? `${BASE_URL}/${car.image}` : null,
    }));
  }

  async getCarById(id) {
    const car = await CarRepository.findById(id);
    if (!car) {
      throw new Error("Car not found");
    }
    return {
      ...car,
      image: car.image ? `${BASE_URL}/${car.image}` : null,
    };
  }

  async createCar(carData, file) {
    const image = file ? file.filename : null;

    const newCar = await CarRepository.create({
      name: carData.name,
      price: parseInt(carData.price),
      merk: carData.merk,
      image,
    });

    return {
      ...newCar,
      image: image ? `${BASE_URL}/${image}` : null,
    };
  }

  async updateCar(id, carData, file) {
    const existingCar = await CarRepository.findById(id);
    if (!existingCar) {
      throw new Error("Car not found");
    }

    // Prepare update data
    const updateData = {
      ...(carData.name && { name: carData.name }),
      ...(carData.price && { price: parseInt(carData.price) }),
      ...(carData.merk && { merk: carData.merk }),
    };

    // Handle image update
    if (file) {
      // Delete old image if exists
      if (existingCar.image) {
        const oldImagePath = path.join(UPLOAD_PATH, existingCar.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = file.filename;
    }

    const updatedCar = await CarRepository.update(id, updateData);

    return {
      ...updatedCar,
      image: updatedCar.image ? `${BASE_URL}/${updatedCar.image}` : null,
    };
  }

  async deleteCar(id) {
    const existingCar = await CarRepository.findById(id);
    if (!existingCar) {
      throw new Error("Car not found");
    }

    if (existingCar.image) {
      const imagePath = path.join(UPLOAD_PATH, existingCar.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await CarRepository.delete(id);
  }
}

module.exports = new CarService();
