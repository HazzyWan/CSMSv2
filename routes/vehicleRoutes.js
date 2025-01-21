const express = require('express');
const { applyVehicle, updateVehicleStatus } = require('../controllers/vehicleController');
const router = express.Router();

// Route to apply for a vehicle
router.post('/apply', applyVehicle);

// Route to update the vehicle application status (by admin)
router.put('/status/:vehicleId', updateVehicleStatus);

module.exports = router;
