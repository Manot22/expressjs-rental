// src/routes/carRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload");
const carController = require("../cars/carController");

router.get("/", carController.getAllCars);

router.get("/:id", carController.getCarById);

router.post("/", upload.single("image"), carController.createCar);

router.put("/:id", upload.single("image"), carController.updateCar);

router.delete("/:id", carController.deleteCar);

module.exports = router;
