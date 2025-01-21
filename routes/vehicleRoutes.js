const express = require('express');
const router = express.Router();

router.post('/apply', async (req, res) => {
  try {
    // Your logic to handle the vehicle application
    res.status(200).json({ message: 'Vehicle application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for vehicle' });
  }
});
module.exports = router;
