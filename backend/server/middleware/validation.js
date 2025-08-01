// src/middleware/validation.js

export const validateUserRegistration = (req, res, next) => {
    // CORRECTED: company_id removed from destructuring
    const { username, email, password } = req.body;

    // Basic validation checks (company_id check removed)
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required." });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }

    next();
};

export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required for login." });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    next();
};