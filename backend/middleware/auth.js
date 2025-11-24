const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user with JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is deactivated' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required' });
  }
};

// Middleware to check if user is shopper
exports.isShopper = (req, res, next) => {
  if (req.user && req.user.role === 'shopper') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Shopper role required' });
  }
};

// Middleware to check if user is admin or shopper
exports.isAdminOrShopper = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'shopper')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or shopper role required' });
  }
};

// Middleware to check if user is the owner of a resource or an admin
exports.isOwnerOrAdmin = (resourceField) => {
  return (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user.id;
    
    if (req.user.role === 'admin') {
      return next();
    }
    
    if (resourceField === 'user' && resourceId === userId) {
      return next();
    }
    
    if (req[resourceField] && req[resourceField].user && req[resourceField].user.toString() === userId) {
      return next();
    }
    
    res.status(403).json({ message: 'Access denied. Not authorized to access this resource' });
  };
};

// Optional authentication - allows guest users but attaches user if token is present
exports.optionalAuthenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token provided - continue as guest
      req.user = null;
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      // Invalid or inactive user - continue as guest
      req.user = null;
      return next();
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    // Token verification failed - continue as guest
    console.log('Optional auth: Token invalid, continuing as guest');
    req.user = null;
    next();
  }
};
