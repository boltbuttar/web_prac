const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tutor profile
const getTutorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('tutorProfile');
    
    if (!user || user.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get tutor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update tutor profile
const updateTutorProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    // Update tutor profile fields
    if (req.body.tutorProfile) {
      user.tutorProfile = { ...user.tutorProfile, ...req.body.tutorProfile };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update tutor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('studentProfile');
    
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update profile fields
    if (req.body.profile) {
      user.profile = { ...user.profile, ...req.body.profile };
    }

    // Update student profile fields
    if (req.body.studentProfile) {
      user.studentProfile = { ...user.studentProfile, ...req.body.studentProfile };
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getTutorProfile,
  updateTutorProfile,
  getStudentProfile,
  updateStudentProfile,
}; 