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
    // Defensive copy of request body
    const requestData = { ...req.body };
    const { email, password, firstName, lastName, role } = requestData;

    console.log("Received registration request:", req.body);

    try {
        // Check if the email already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('BASE_USER')
            .select('email')
            .eq('email', email)
            .single();

        if (existingUser) {
            console.error("Email already exists:", email);
            return res.status(400).json({ error: "Email already registered. Please use a different email." });
        }

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error checking for existing email:", checkError);
            return res.status(500).json({ error: "Error checking email existence.", details: checkError });
        }
        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign the role
        const userRole = role === 'Student/Staff' ? 'User' : role;
        console.log("Assigned role:", userRole);

        // Insert into BASE_USER table with hashed password
        const { data: baseUserData, error: baseUserError } = await supabase
            .from('BASE_USER')
            .insert([{ email, password: hashedPassword }])
            .select();

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

        const baseuserid = baseUserData[0].baseuserid;

        // Insert into USER table with the role ("User" for Student/Staff)
        const { data: userData, error: userError } = await supabase
            .from('USER')
            .insert([{ baseuserid, first_name: firstName, last_name: lastName, role: userRole }])
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

//Login function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Login attempt:', { email });

    try {
        // Step 1: Get the user from the BASE_USER table
        const { data: baseUser, error: baseUserError } = await supabase
            .from('BASE_USER')
            .select('baseuserid, email, password') // Select required fields
            .eq('email', email)
            .single(); // Ensure we fetch only one record

        if (baseUserError || !baseUser) {
            console.error('Error or user not found in BASE_USER:', baseUserError);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Step 2: Compare the password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, baseUser.password);

        if (!isPasswordValid) {
            console.error('Password mismatch for user:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Step 3: Get additional user info from the USER table
        const { data: user, error: userError } = await supabase
            .from('USER')
            .select('userid, role') // Only select necessary fields
            .eq('baseuserid', baseUser.baseuserid)
            .single();

        if (userError || !user) {
            console.error('Error or user not found in USER table:', userError);
            return res.status(500).json({ error: 'Failed to retrieve user role.', details: userError });
        }

        // Step 4: Create JWT token
        const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
        const token = jwt.sign(
            { userId: user.userid, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time (1 hour)
        );

        // Log the successful login
        console.log('Login successful for:', email);

        // Step 5: Return the response with the token and user data
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { userid: user.userid, email: baseUser.email, role: user.role } // Combine data for response
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'An unexpected error occurred during login', details: error.message });
    }
};



module.exports = { registerUser, loginUser };
