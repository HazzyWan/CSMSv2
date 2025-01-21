// adminController.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);
// Function to register an admin
const registerAdmin = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Insert into BASE_USER table
        const { data: baseUserData, error: baseUserError } = await supabase
            .from('BASE_USER')
            .insert([{ Email: email, Password: password }]);

        if (baseUserError) throw baseUserError;

        // Insert into ADMIN table
        const { data: adminData, error: adminError } = await supabase
            .from('ADMIN')
            .insert([{ BaseUserID: baseUserData[0].BaseUserID, First_Name: firstName, Last_Name: lastName }]);

        if (adminError) throw adminError;

        res.status(201).json({ message: 'Admin registered successfully', adminData });
    } catch (error) {
        res.status(500).json({ error: 'Error registering admin: ' + error.message });
    }
};

// Function to fetch admin details by adminId
const getAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const { data, error } = await supabase
            .from('ADMIN')
            .select('*')
            .eq('AdminID', adminId)
            .single();  // Use single to return only one record (specific admin)

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        return res.status(200).json({ admin: data });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching admin: ' + error.message });
    }
};

// Export the functions
module.exports = {
    registerAdmin,
    getAdmin
};
