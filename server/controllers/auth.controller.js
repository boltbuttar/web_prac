const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const register = async (req, res) => {
  try {
    console.log('Received registration request:', req.body); // Debug log

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role, profile, tutorProfile, studentProfile } = req.body;
    console.log('Extracted data:', { username, email, role, profile, tutorProfile, studentProfile }); // Debug log

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log('User already exists:', user); // Debug log
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with role-specific profile
    const userData = {
      username,
      email,
      password,
      role,
      profile
    };

    // Add role-specific profile data
    if (role === 'tutor' && tutorProfile) {
      userData.tutorProfile = tutorProfile;
    } else if (role === 'student' && studentProfile) {
      userData.studentProfile = studentProfile;
    }

    console.log('Creating user with data:', userData); // Debug log
    user = new User(userData);
    
    try {
      await user.save();
      console.log('User saved successfully:', user); // Debug log
    } catch (saveError) {
      console.error('Error saving user:', saveError); // Debug log
      throw saveError;
    }

    // Generate token
    const token = generateToken(user._id);

    // Prepare response data
    const responseData = {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    };

    // Add role-specific profile to response
    if (role === 'tutor') {
      responseData.user.tutorProfile = user.tutorProfile;
    } else if (role === 'student') {
      responseData.user.studentProfile = user.studentProfile;
    }

    console.log('Sending response:', responseData); // Debug log
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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

module.exports = {
  register,
  login,
  getProfile
}; 