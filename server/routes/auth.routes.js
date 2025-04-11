const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth.middleware');
const { register, login, getProfile } = require('../controllers/auth.controller');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address (e.g., example@domain.com)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['student', 'tutor'])
    .withMessage('Invalid role'),
  body('profile.firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('profile.lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('profile.phone')
    .optional()
    .trim()
    .matches(/^[0-9]{10,11}$/)  // Allow 10-11 digit phone numbers
    .withMessage('Please enter a valid phone number (10-11 digits)'),
  body('profile.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  // Tutor-specific validation
  body('tutorProfile.subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),
  body('tutorProfile.hourlyRate')
    .optional()
    .isNumeric()
    .withMessage('Hourly rate must be a number'),
  body('tutorProfile.qualifications')
    .optional()
    .isArray()
    .withMessage('Qualifications must be an array'),
  body('tutorProfile.experience')
    .optional()
    .isNumeric()
    .withMessage('Experience must be a number'),
  // Student-specific validation
  body('studentProfile.grade')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Grade cannot be empty'),
  body('studentProfile.subjects')
    .optional()
    .isArray()
    .withMessage('Subjects must be an array'),
  body('studentProfile.preferredLearningStyle')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Preferred learning style cannot be empty')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', auth, getProfile);

module.exports = router; 