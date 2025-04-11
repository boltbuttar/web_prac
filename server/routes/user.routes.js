const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getTutorProfile,
  updateTutorProfile,
  getStudentProfile,
  updateStudentProfile,
} = require('../controllers/user.controller');

const router = express.Router();

// Validation middleware
const profileValidation = [
  body('profile.firstName').optional().trim().notEmpty(),
  body('profile.lastName').optional().trim().notEmpty(),
  body('profile.phone').optional().trim().matches(/^\+?[1-9]\d{1,14}$/),
  body('profile.city').optional().trim().notEmpty(),
  body('profile.bio').optional().trim(),
];

const tutorProfileValidation = [
  ...profileValidation,
  body('tutorProfile.subjects').optional().isArray(),
  body('tutorProfile.hourlyRate').optional().isNumeric().isFloat({ min: 0 }),
  body('tutorProfile.qualifications').optional().isArray(),
  body('tutorProfile.experience').optional().isNumeric().isInt({ min: 0 }),
  body('tutorProfile.availability').optional().isArray(),
];

const studentProfileValidation = [
  ...profileValidation,
  body('studentProfile.grade').optional().trim().notEmpty(),
  body('studentProfile.subjects').optional().isArray(),
  body('studentProfile.preferredLearningStyle').optional().trim().notEmpty(),
];

// Routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, profileValidation, updateProfile);

// Tutor-specific routes
router.get('/tutor/:id', getTutorProfile);
router.put('/tutor/profile', auth, tutorProfileValidation, updateTutorProfile);

// Student-specific routes
router.get('/student/:id', getStudentProfile);
router.put('/student/profile', auth, studentProfileValidation, updateStudentProfile);

module.exports = router; 