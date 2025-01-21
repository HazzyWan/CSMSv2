// userController.js
const { createClient } = require('@supabase/supabase-js');
// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);

// Function to get user details by userId
const getUser = async (req, res) => {
  const { userid } = req.params;  // Extract userId from the URL params

  // Log the received userId to debug
  console.log('Received userId:', userid);  // This will show if userId is being passed properly

  try {
    if (!userid) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    // Query the USER table using the userId
    const { data, error } = await supabase
      .from('USER')
      .select('first_name, last_name')
      .eq('userid', userid)
      .single();  // Use single to get only one record (for a specific user)

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: data });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user: ' + error.message });
  }
};




// Function to update user details by userId
const updateUserDetails = async (req, res) => {
  const { userid } = req.params;  // Extract userId from the URL params
  const { firstName, lastName, matricNo, plateNo } = req.body;  // Extract data from the body
  console.log('Request Body:', req.body);  // Add this for debugging

  try {
      // Update the USER table with new user details
      const { data, error } = await supabase
          .from('USER')
          .update({ first_name: firstName, last_name: lastName, matric_no: matricNo, plate_no: plateNo })
          .eq('UserID', userid);  // Update where UserID matches the userId in the URL

      if (error) throw error;
      
      if (data.length === 0) {
          return res.status(404).json({ message: 'User not found or no changes made' });
      }

      return res.status(200).json({ message: 'User details updated successfully', updatedUser: data });
  } catch (error) {
      return res.status(500).json({ error: 'Error updating user: ' + error.message });
  }
};

module.exports = {
  getUser,
  updateUserDetails
};
  