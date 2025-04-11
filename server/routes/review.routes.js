const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getTutorReviews,
  getStudentReviews,
} = require('../controllers/review.controller');

const router = express.Router();

// Validation middleware
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().notEmpty(),
];

// Routes
router.post('/:sessionId', auth, reviewValidation, createReview);
router.get('/:id', auth, getReview);
router.put('/:id', auth, reviewValidation, updateReview);
router.delete('/:id', auth, deleteReview);

// Get reviews for a tutor
router.get('/tutor/:tutorId', getTutorReviews);

// Get reviews by a student
router.get('/student/:studentId', getStudentReviews);

module.exports = router; 