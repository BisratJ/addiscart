const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, isAdmin, isOwnerOrAdmin } = require('../middleware/auth');

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (own profile or admin)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is requesting their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private (own profile or admin)
router.put(
  '/:id',
  authenticate,
  [
    body('name', 'Name is required').optional().not().isEmpty(),
    body('email', 'Please include a valid email').optional().isEmail(),
    body('phone', 'Phone number is required').optional().not().isEmpty(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    try {
      const { name, email, phone, avatar } = req.body;
      
      // Build user object
      const userFields = {};
      if (name) userFields.name = name;
      if (phone) userFields.phone = phone;
      if (avatar) userFields.avatar = avatar;
      
      // Check if email is being changed
      if (email) {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id !== req.params.id) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        
        userFields.email = email;
      }
      
      // Update user
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: userFields },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/users/:id/password
// @desc    Update user password
// @access  Private (own profile or admin)
router.put(
  '/:id/password',
  authenticate,
  [
    body('currentPassword', 'Current password is required').not().isEmpty(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user is updating their own password or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST api/users/:id/addresses
// @desc    Add a new address to user
// @access  Private (own profile or admin)
router.post(
  '/:id/addresses',
  authenticate,
  [
    body('street', 'Street is required').not().isEmpty(),
    body('city', 'City is required').not().isEmpty(),
    body('state', 'State is required').not().isEmpty(),
    body('zipCode', 'Zip code is required').not().isEmpty(),
    body('default', 'Default status is required').isBoolean(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    try {
      const { street, city, state, zipCode, default: isDefault } = req.body;
      
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Create new address object
      const newAddress = {
        street,
        city,
        state,
        zipCode,
        default: isDefault,
      };
      
      // If this address is set as default, update all other addresses
      if (isDefault) {
        user.addresses.forEach((address) => {
          address.default = false;
        });
      }
      
      // Add new address to user
      user.addresses.push(newAddress);
      
      // Save user
      await user.save();
      
      res.json(user.addresses);
    } catch (error) {
      console.error('Error adding address:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/users/:id/addresses/:addressId
// @desc    Update user address
// @access  Private (own profile or admin)
router.put(
  '/:id/addresses/:addressId',
  authenticate,
  [
    body('street', 'Street is required').optional().not().isEmpty(),
    body('city', 'City is required').optional().not().isEmpty(),
    body('state', 'State is required').optional().not().isEmpty(),
    body('zipCode', 'Zip code is required').optional().not().isEmpty(),
    body('default', 'Default status is required').optional().isBoolean(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    try {
      const { street, city, state, zipCode, default: isDefault } = req.body;
      
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Find address index
      const addressIndex = user.addresses.findIndex(
        (address) => address._id.toString() === req.params.addressId
      );
      
      if (addressIndex === -1) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      // Update address fields
      if (street) user.addresses[addressIndex].street = street;
      if (city) user.addresses[addressIndex].city = city;
      if (state) user.addresses[addressIndex].state = state;
      if (zipCode) user.addresses[addressIndex].zipCode = zipCode;
      
      // If this address is set as default, update all other addresses
      if (isDefault !== undefined) {
        if (isDefault) {
          user.addresses.forEach((address, index) => {
            address.default = index === addressIndex;
          });
        } else {
          user.addresses[addressIndex].default = false;
        }
      }
      
      // Save user
      await user.save();
      
      res.json(user.addresses);
    } catch (error) {
      console.error('Error updating address:', error.message);
      
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User or address not found' });
      }
      
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/users/:id/addresses/:addressId
// @desc    Delete user address
// @access  Private (own profile or admin)
router.delete('/:id/addresses/:addressId', authenticate, async (req, res) => {
  // Check if user is updating their own profile or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find address index
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === req.params.addressId
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Don't allow deletion of the default address if it's the only address
    if (user.addresses[addressIndex].default && user.addresses.length === 1) {
      return res.status(400).json({ message: 'Cannot delete the only address' });
    }
    
    // Remove address
    user.addresses.splice(addressIndex, 1);
    
    // If the deleted address was the default and there are other addresses,
    // set the first address as default
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.default)) {
      user.addresses[0].default = true;
    }
    
    // Save user
    await user.save();
    
    res.json(user.addresses);
  } catch (error) {
    console.error('Error deleting address:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User or address not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Instead of deleting, deactivate the user
    user.isActive = false;
    await user.save();
    
    res.json({ message: 'User deactivated' });
  } catch (error) {
    console.error('Error deactivating user:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
