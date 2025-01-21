const express = require('express');
const { registerOfficer, getOfficer } = require('../controllers/officerController');
const router = express.Router();

// Route to register a new officer
router.post('/register', registerOfficer);

// Route to fetch officer details by officer ID
router.get('/:officerId', getOfficer);

module.exports = router;
