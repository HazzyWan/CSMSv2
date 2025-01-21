const express = require('express');
const { registerAdmin, getAdmin } = require('../controllers/adminController');
const router = express.Router();

// Route to register a new admin
router.post('/register', registerAdmin);

// Route to fetch admin details by admin ID
router.get('/:adminId', getAdmin);

module.exports = router;
