const express = require('express');
const { uploadFine, getFineDetails } = require('../controllers/fineController');
const router = express.Router();

// Route to upload a fine
router.post('/upload', uploadFine);

// Route to get fine details by fine ID
router.get('/:fineId', getFineDetails);

module.exports = router;
