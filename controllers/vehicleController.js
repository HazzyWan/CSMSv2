const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const { validationResult } = require('express-validator');

// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Supabase API Key
);

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to apply for a vehicle
const applyVehicle = async (req, res) => {
  upload.single('vehicle_photo')(req, res, async () => {
    const { user_id, plate_no } = req.body;
    const file = req.file;

    // Validate inputs
    if (!user_id || !plate_no || !file) {
      return res.status(400).json({
        error: 'User ID, plate number, and vehicle photo are required.',
      });
    }

    // Optional: Regex for plate number validation
    const plateRegex = /^[A-Z0-9-]{1,10}$/;
    if (!plateRegex.test(plate_no)) {
      return res.status(400).json({ error: 'Invalid plate number format.' });
    }

    try {
      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle_photos') // Replace with your Supabase bucket name
        .upload(`vehicle_photos/${Date.now()}_${file.originalname}`, file.buffer);

      if (uploadError) throw uploadError;

      const photo_url = supabase.storage
        .from('vehicle_photos')
        .getPublicUrl(uploadData.path).data.publicUrl;

      // Insert into the VEHICLE_APPLY table
      const { data, error } = await supabase
        .from('VEHICLE_APPLY')
        .insert([
          {
            user_id,
            plate_no,
            vehicle_photo: photo_url,
            application_date: new Date(),
            status: 'pending',
          },
        ]);

      if (error) throw error;

      res.status(200).json({
        message: 'Vehicle application submitted successfully.',
        data,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error submitting vehicle application: ' + error.message,
      });
    }
  });
};

// Function to update vehicle application status (admin only)
const updateVehicleStatus = async (req, res) => {
  const { vehicleId } = req.params;
  const { status } = req.body;

  // Validate status
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Only "approved" or "rejected" are allowed.',
    });
  }

  try {
    const { data, error } = await supabase
      .from('VEHICLE_APPLY')
      .update({
        status,
        approval_date: new Date(),
      })
      .eq('vehicle_id', vehicleId);

    if (error) throw error;

    res.status(200).json({
      message: `Application ${status.toLowerCase()} successfully.`,
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error updating vehicle status: ' + error.message,
    });
  }
};

module.exports = {
  applyVehicle,
  updateVehicleStatus,
};
