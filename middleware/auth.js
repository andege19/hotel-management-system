//  Authentication Middleware for Hotel Management System
module.exports.authenticateUser = (allowedRoles) => {
    return (req, res, next) => {
        
        if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send('Access denied. You do not have permission to view this page.');
        }
        next();
    };
};
