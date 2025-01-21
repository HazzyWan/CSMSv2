const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
    'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);

// Registration function
const registerUser = async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body;

    console.log("Received registration request:", req.body);

    try {
        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into BASE_USER table with hashed password
        const { data: baseUserData, error: baseUserError } = await supabase
            .from('BASE_USER')
            .insert([{ email, password: hashedPassword }])
            .select();  // Use select() to get the inserted data

        if (baseUserError) {
            console.error("Error inserting into BASE_USER:", baseUserError);
            return res.status(500).json({ error: "Failed to insert user into BASE_USER.", details: baseUserError });
        }

        console.log("BASE_USER insert result:", baseUserData);

        // Ensure the BaseUserID exists
        if (!baseUserData || !baseUserData[0]) {
            console.error("BaseUserID not found after inserting into BASE_USER");
            return res.status(500).json({ error: "BaseUserID not found after registration." });
        }

        const baseuserid = baseUserData[0].baseuserid; // Correct way to access baseuserid

        // Insert into USER table with the role
        const { data: userData, error: userError } = await supabase
            .from('USER')
            .insert([{ baseuserid, first_name: firstName, last_name: lastName, role }])
            .select();

        if (userError) {
            console.error("Error inserting into USER table:", userError);
            return res.status(500).json({ error: "Failed to insert user into USER table." });
        }

        console.log("USER insert result:", userData);

        return res.status(201).json({ message: "User created successfully", user: userData });

    } catch (err) {
        console.error("Error during registration:", err.message);
        return res.status(500).json({ error: "An unexpected error occurred during registration", details: err.message });
    }
};


// Login function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Login attempt:', { email });

    try {
        // Get the user from the USER table
        const { data, error } = await supabase
            .from('USER')
            .select('*')
            .eq('email', email)
            .single();

        console.log('Fetched user data:', data, error);

        if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, data.password);
        console.log('Password comparison result:', isPasswordValid);

        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

        // Create JWT token
        const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
        const token = jwt.sign({ userId: data.user_id }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'An unexpected error occurred during login' });
    }
};

module.exports = { registerUser, loginUser };
