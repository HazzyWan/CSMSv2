const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this line to import the 'path' module
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const fineRoutes = require('./routes/fineRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Supabase
const supabase = createClient(
  'https://rdhzbttofofvybbnfxlk.supabase.co', // Replace with your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHpidHRvZm9mdnliYm5meGxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM1MzIxNCwiZXhwIjoyMDUyOTI5MjE0fQ.a8_sHdX1DHo03zF_sTNXsIzHSyJbskVi589pSTQdWBo' // Replace with your Supabase API key
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection and sync
const testDatabaseConnection = async () => {
  try {
    // Attempt a simple query to check the database connection
    const { data, error } = await supabase.from('VEHICLE_APPLY').select().limit(1);

    if (error && error.message.includes("relation \"public.VEHICLE_APPLY\" does not exist")) {
      // If the table doesn't exist, we log it but don't exit the server
      console.log("Table VEHICLE_APPLY does not exist. Skipping table check.");
    } else if (error) {
      // Handle any other errors
      console.error("Database connection failed:", error.message);
    } else {
      // If query is successful
      console.log("Database connected successfully");
    }
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
};

// Skip exiting on missing tables
const validateSchema = async () => {
  const requiredTables = ['fines', 'security_updates']; // Removed 'vehicles' from the list

  try {
    for (let table of requiredTables) {
      const { data, error } = await supabase.from(table).select().limit(1);
      if (error && error.message.includes("does not exist")) {
        console.log(`Table ${table} does not exist. Skipping validation.`);
      } else if (error) {
        console.error(`Error with table ${table}:`, error.message);
      }
    }
    console.log("Database schema validation completed.");
  } catch (err) {
    console.error("Error checking schema:", err.message);
  }
};

// Perform the initial connection test and schema validation before starting the server
const initializeDatabase = async () => {
  console.log("Initializing database...");
  await testDatabaseConnection();
  await validateSchema();
};

// Routes
app.use('/api/auth', authRoutes);  // Handling authentication-related routes
app.use('/api/users', userRoutes); // Handle all user-related routes (admin, officer, user)
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/posts', postRoutes);

// Test route for confirming server is working
app.get('/api/test', (req, res) => {
  res.send("Test route is working!");
});

// Start the server and log confirmation
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  initializeDatabase(); // Initialize database once the server starts
});

// Serve static files from the 'frontend/src' folder during development
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));

// Root route (/) to serve the landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/pages/landing.html'));
});