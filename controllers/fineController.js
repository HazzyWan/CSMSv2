const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase (move this outside the function to initialize once)
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);
// Function to upload a fine
const uploadFine = async (req, res) => {
    const { userId, officerId, amount, reason } = req.body;

    try {
        const { data, error } = await supabase
            .from('COMPOUND_FINE')
            .insert([{ UserID: userId, OfficerID: officerId, Amount: amount, Reason: reason, Issue_Date: new Date() }]);

        if (error) throw error;

        res.status(200).json({ message: 'Fine uploaded successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading fine: ' + error.message });
    }
};

// Function to get fine details by fine ID
const getFineDetails = async (req, res) => {
    const { fineId } = req.params; // Extract fineId from the URL params

    try {
        // Query the COMPOUND_FINE table using the fineId
        const { data, error } = await supabase
            .from('COMPOUND_FINE')
            .select('*')
            .eq('FineID', fineId) // Filter by FineID
            .single(); // Use single to return only one record (specific fine)

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Fine not found' });
        }

        return res.status(200).json({ fine: data });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching fine details: ' + error.message });
    }
};

module.exports = {
    uploadFine,
    getFineDetails
};
