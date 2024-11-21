const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Initialize express app
const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT || 2003;
const UPLOAD_PATH = path.join(__dirname, "/uploads");

// Middleware
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_PATH));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

// Import routes
const carRoutes = require("./routes/carRoutes");

// Use routes
app.use("/cars", carRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

// const express = require("express");
// const dotenv = require("dotenv");
// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const prisma = require("./db");
// const cors = require("cors");

// // Initialize express app
// const app = express();
// dotenv.config();

// // Constants
// const PORT = process.env.PORT || 2003;
// const UPLOAD_PATH = path.join(__dirname, "src/uploads");
// const BASE_URL = `http://localhost:${PORT}/uploads`;

// // Middleware
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     optionsSuccessStatus: 200,
//   })
// );

// // Ensure uploads directory exists
// if (!fs.existsSync(UPLOAD_PATH)) {
//   fs.mkdirSync(UPLOAD_PATH, { recursive: true });
// }

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOAD_PATH);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // GET all cars with proper error handling
// app.get("/cars", async (req, res) => {
//   try {
//     const cars = await prisma.cars.findMany({
//       orderBy: {
//         id: "desc",
//       },
//     });

//     // Transform image URLs
//     const carsWithFullUrl = cars.map((car) => ({
//       id: car.id,
//       name: car.name,
//       price: car.price,
//       merk: car.merk,
//       image: car.image ? `${BASE_URL}/${car.image}` : null,
//       createdAt: car.createdAt,
//       updatedAt: car.updatedAt,
//     }));

//     // Send successful response
//     res.status(200).json({
//       success: true,
//       message: "Cars retrieved successfully",
//       data: carsWithFullUrl,
//     });
//   } catch (error) {
//     console.error("Error fetching cars:", error);

//     // Check for specific error types
//     if (error.code === "P2002") {
//       return res.status(400).json({
//         success: false,
//         message: "Database constraint violation",
//         error: error.message,
//       });
//     }

//     if (error.code === "P2021") {
//       return res.status(400).json({
//         success: false,
//         message: "The table 'cars' does not exist in the database",
//         error: error.message,
//       });
//     }

//     // Generic error response
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch cars",
//       error: error.message,
//     });
//   } finally {
//     // Always disconnect from database
//     await prisma.$disconnect();
//   }
// });

// // GET CAR BY ID
// app.get("/cars/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ID
//     const carId = parseInt(id);
//     if (isNaN(carId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid ID format",
//       });
//     }

//     // Get car by ID
//     const car = await prisma.cars.findUnique({
//       where: { id: carId },
//     });

//     // Check if car exists
//     if (!car) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     // Transform image URL
//     const carWithFullUrl = {
//       ...car,
//       image: car.image ? `${BASE_URL}/${car.image}` : null,
//     };

//     res.status(200).json({
//       success: true,
//       message: "Car retrieved successfully",
//       data: carWithFullUrl,
//     });
//   } catch (error) {
//     console.error("Error fetching car:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch car",
//       error: error.message,
//     });
//   }
// });

// // POST new car
// app.post("/cars", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, merk } = req.body;
//     const image = req.file ? req.file.filename : null;

//     // Input validation
//     if (!name || !price || !merk) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const newCar = await prisma.cars.create({
//       data: {
//         name,
//         price: parseInt(price),
//         merk,
//         image,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         ...newCar,
//         image: image ? `${BASE_URL}/${image}` : null,
//       },
//       message: "Car created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating car:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create car",
//       error: error.message,
//     });
//   }
// });

// // PUT/UPDATE car by ID
// app.put("/cars/:id", upload.single("image"), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, price, merk } = req.body;
//     const image = req.file ? req.file.filename : undefined;

//     // Validate ID
//     const carId = parseInt(id);
//     if (isNaN(carId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid ID format",
//       });
//     }

//     // Check if car exists
//     const existingCar = await prisma.cars.findUnique({
//       where: { id: carId },
//     });

//     if (!existingCar) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     // Prepare update data
//     const updateData = {
//       ...(name && { name }),
//       ...(price && { price: parseInt(price) }),
//       ...(merk && { merk }),
//       ...(image && { image }),
//     };

//     // If there's a new image, delete the old one
//     if (image && existingCar.image) {
//       const oldImagePath = path.join(UPLOAD_PATH, existingCar.image);
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }
//     }

//     // Update car
//     const updatedCar = await prisma.cars.update({
//       where: { id: carId },
//       data: updateData,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Car updated successfully",
//       data: {
//         ...updatedCar,
//         image: updatedCar.image ? `${BASE_URL}/${updatedCar.image}` : null,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating car:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update car",
//       error: error.message,
//     });
//   }
// });

// // Delete Car by id
// app.delete("/cars/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ID
//     const carId = parseInt(id);
//     if (isNaN(carId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid ID format",
//       });
//     }

//     // Check if car exists and get its image
//     const existingCar = await prisma.cars.findUnique({
//       where: { id: carId },
//     });

//     if (!existingCar) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     // Delete the image file if it exists
//     if (existingCar.image) {
//       const imagePath = path.join(UPLOAD_PATH, existingCar.image);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     // Delete the car from database
//     await prisma.cars.delete({
//       where: { id: carId },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Car deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting car:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete car",
//       error: error.message,
//     });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// module.exports = app;
