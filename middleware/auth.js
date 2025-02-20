// middleware/auth.js - Authentication Middleware for Hotel Management System
module.exports.authenticateUser = (allowedRoles) => {
    return (req, res, next) => {
        // Check if user is logged in and if their role is among the allowed roles
        if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send('Access denied. You do not have permission to view this page.');
        }
        next();
    };
};
