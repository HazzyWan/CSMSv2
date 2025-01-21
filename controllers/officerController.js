const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);
const registerOfficer = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Insert into BASE_USER table
        const { data: baseUserData, error: baseUserError } = await supabase
            .from('BASE_USER')
            .insert([{ Email: email, Password: password }]);

        if (baseUserError) throw baseUserError;

        // Insert into OFFICER table (was previously inserting into ADMIN table)
        const { data: officerData, error: officerError } = await supabase
            .from('OFFICER')
            .insert([{ BaseUserID: baseUserData[0].BaseUserID, First_Name: firstName, Last_Name: lastName }]);

        if (officerError) throw officerError;

        res.status(201).json({ message: 'Officer registered successfully', officerData });
    } catch (error) {
        res.status(500).json({ error: 'Error registering Officer: ' + error.message });
    }
};

// Function to fetch officer details by officerId
const getOfficer = async (req, res) => {
    const { officerId } = req.params; // Extract officerId from the URL params

    try {
        // Query the OFFICER table using the officerId
        const { data, error } = await supabase
            .from('OFFICER')
            .select('*')
            .eq('OfficerID', officerId) // Filter by OfficerID
            .single();  // Use single to return only one record (specific officer)

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Officer not found' });
        }

        return res.status(200).json({ officer: data });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching officer: ' + error.message });
    }
};

module.exports = {
    registerOfficer,
    getOfficer
};
