// src/controllers/carController.js
const CarService = require("./carService");

class CarController {
  async getAllCars(req, res) {
    try {
      const cars = await CarService.getAllCars();
      res.status(200).json({
        success: 200,
        message: "Get all car successfully",
        data: cars,
      });
    } catch (error) {
      console.error("Error fetching cars:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cars",
        error: error.message,
      });
    }
  }

  async getCarById(req, res) {
    try {
      const carId = parseInt(req.params.id);

      if (isNaN(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      const car = await CarService.getCarById(carId);
      res.status(200).json({
        success: true,
        message: "Car retrieved successfully",
        data: car,
      });
    } catch (error) {
      console.error("Error fetching car:", error);
      if (error.message === "Car not found") {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to fetch car",
        error: error.message,
      });
    }
  }

  async createCar(req, res) {
    try {
      const { name, price, merk } = req.body;

      // Input validation
      if (!name || !price || !merk) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const newCar = await CarService.createCar(req.body, req.file);
      res.status(201).json({
        success: true,
        message: "Car created successfully",
        data: newCar,
      });
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create car",
        error: error.message,
      });
    }
  }

  async updateCar(req, res) {
    try {
      const carId = parseInt(req.params.id);

      if (isNaN(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      const updatedCar = await CarService.updateCar(carId, req.body, req.file);
      res.status(200).json({
        success: true,
        message: "Car updated successfully",
        data: updatedCar,
      });
    } catch (error) {
      console.error("Error updating car:", error);
      if (error.message === "Car not found") {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to update car",
        error: error.message,
      });
    }
  }

  async deleteCar(req, res) {
    try {
      const carId = parseInt(req.params.id);

      if (isNaN(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      await CarService.deleteCar(carId);
      res.status(200).json({
        success: true,
        message: "Car deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      if (error.message === "Car not found") {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to delete car",
        error: error.message,
      });
    }
  }
}

module.exports = new CarController();
