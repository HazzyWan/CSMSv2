const express = require('express');
const { getUser, updateUserDetails } = require('../controllers/userController');
const router = express.Router();

// Route to fetch user details by user ID (change to 'userid' to match frontend)
router.get('/:userid', getUser);

// Route to update user details
router.put('/:userid', updateUserDetails);

module.exports = router;
