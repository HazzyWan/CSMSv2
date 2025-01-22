const express = require('express');
const upload = require("../middleware/multerConfig"); // Import the Multer configuration
const { isAuthenticated } = require('../middleware/authMiddleware'); // Import the authMiddleware
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

// Protect the '/apply' route with authentication middleware
router.post('/apply', isAuthenticated, upload.single('vehicle_photo'), vehicleController.createVehicleApplication);

module.exports = router;
