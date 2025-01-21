const express = require('express');
const { getUser, updateUserDetails } = require('../controllers/userController');
const router = express.Router();

// Route to fetch user details by user ID
router.get('/:userId', getUser);

// Route to update user details
router.put('/:userId', updateUserDetails);

module.exports = router;
