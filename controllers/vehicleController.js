const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);
// Function to apply for a vehicle
const applyVehicle = async (req, res) => {
    const { userId, adminId, plateNo } = req.body;

    try {
        // Insert into VEHICLE_APPLY table
        const { data, error } = await supabase
            .from('VEHICLE_APPLY')  // Correct table name
            .insert([
                {
                    UserID: userId, 
                    AdminID: adminId, 
                    Plate_No: plateNo, 
                    Application_Date: new Date(),
                    Status: 'Pending'  // Default status is 'Pending'
                }
            ]);

        if (error) throw error;

        res.status(200).json({ message: 'Vehicle application submitted', data });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting vehicle application: ' + error.message });
    }
};

// Function to update vehicle application status (admin only)
const updateVehicleStatus = async (req, res) => {
    const { vehicleId } = req.params;
    const { status, approvalDate } = req.body;  // Expecting new status and approval date

    try {
        const { data, error } = await supabase
            .from('VEHICLE_APPLY')  // Correct table name
            .update({ 
                Status: status,
                Approval_Date: approvalDate
            })
            .eq('VehicleID', vehicleId);  // Update the specific vehicle by VehicleID

        if (error) throw error;

        res.status(200).json({ message: 'Vehicle status updated successfully', data });
    } catch (error) {
        res.status(500).json({ error: 'Error updating vehicle status: ' + error.message });
    }
};

module.exports = {
    applyVehicle,
    updateVehicleStatus
};
