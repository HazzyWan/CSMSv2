const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Define the routes for authentication
router.post('/register', registerUser);  // This will call the registerUser function in your controller
router.post('/login', loginUser);        // This will call the loginUser function in your controller


module.exports = router;
