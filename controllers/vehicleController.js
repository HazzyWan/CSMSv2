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

/**
 * Create a vehicle application
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
const createVehicleApplication = async (req, res) => {
    try {
      const { plate_no, matric_no } = req.body;  // Assuming matric_no is passed in the request body
      const vehicle_photo = req.file ? req.file.path : null;
  
      // Ensure req.user is available after authentication
      const loggedInUserId = req.user.userid; // Assuming req.user.userid is set from JWT token
  
      if (!loggedInUserId) {
        return res.status(400).json({ error: 'User ID is missing from user data' });
      }
  
      console.log('Request received for vehicle application');
      console.log('Request body:', { plate_no });
      console.log('Uploaded file path:', vehicle_photo);
  
      // Step 1: Find the user based on logged-in user's userid
      const { data: user, error: userError } = await supabase
        .from('USER')
        .select('userid, plate_no, matric_no')
        .eq('userid', loggedInUserId) // Find user based on userid
        .single();
  
      if (userError || !user) {
        console.error('User not found or error:', userError?.message || 'No user for userid');
        return res.status(404).json({ error: 'User not found for the given User ID' });
      }
  
      console.log('User found:', user);
  
      // Step 2: Update the user's matric_no if provided and it is missing in the USER table
      if (matric_no && !user.matric_no) {
        const { error: updateUserError } = await supabase
          .from('USER')
          .update({ matric_no }) // Update the matric_no for the user
          .eq('userid', user.userid);
  
        if (updateUserError) {
          console.error('Error updating matric_no:', updateUserError.message);
          return res.status(500).json({ error: 'Failed to update user matric_no' });
        }
  
        console.log('User matric_no updated successfully');
      }
  
      // Step 3: Update the user's plate number if not already set
      if (!user.plate_no) {
        const { error: updateUserError } = await supabase
          .from('USER')
          .update({ plate_no })
          .eq('userid', user.userid);
  
        if (updateUserError) {
          console.error('Error updating user plate_no:', updateUserError.message);
          return res.status(500).json({ error: 'Failed to update user plate_no' });
        }
      }
  
      // Step 4: Insert the application into the VEHICLE_APPLY table
      const { data: application, error: applicationError } = await supabase.from('VEHICLE_APPLY').insert([
        {
          UserID: user.userid,
          Plate_No: plate_no,
          vehicle_photo,
          Status: 'Pending',
          Application_Date: new Date().toISOString(),
        },
      ]);
  
      if (applicationError) {
        console.error('Error inserting application:', applicationError.message);
        return res.status(500).json({ error: 'Failed to submit vehicle application' });
      }
  
      console.log('Application inserted successfully:', application);
      res.status(200).json({ message: 'Application submitted successfully', application });
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
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
  createVehicleApplication,
  updateVehicleStatus,
};
