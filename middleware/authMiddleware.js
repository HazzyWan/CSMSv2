const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

// Middleware for authenticating users
const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Authorization header:', req.header('Authorization'));  // Log the header to ensure it's correct
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied, no token provided' });
  }

  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!JWT_SECRET_KEY) {
        return res.status(500).json({ error: 'JWT_SECRET_KEY not defined in environment' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};


module.exports = { isAuthenticated };

