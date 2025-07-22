// src/middleware/validation.js

// Middleware for user registration validation
export const validateUserRegistration = (req, res, next) => {
  const { company_id, username, email, password } = req.body;

  if (!company_id || !username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields (company_id, username, email, password) are required." 
    });
  }

  // Basic email format validation (can be more robust with libraries like 'validator')
  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter a valid email address." 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 6 characters long." 
    });
  }

  next(); // If all checks pass, move to the next middleware/controller
};

// Middleware for user login validation
export const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and password are required for login." 
    });
  }
  next();
};

// You can add more validation middleware for other routes (e.g., CV upload, status update)