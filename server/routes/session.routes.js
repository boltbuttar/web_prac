const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  getStudentSessions,
  getTutorSessions,
  getAllSessions,
} = require('../controllers/session.controller');

const router = express.Router();

// Validation middleware
const sessionValidation = [
  body('subject').trim().notEmpty(),
  body('date').isISO8601(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('duration').isInt({ min: 30, max: 480 }),
  body('location').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('notes').optional().trim(),
];

// Routes
router.post('/', auth, sessionValidation, createSession);
router.get('/:id', auth, getSession);
router.put('/:id', auth, sessionValidation, updateSession);
router.delete('/:id', auth, deleteSession);

// Student routes
router.get('/student/sessions', auth, getStudentSessions);

// Tutor routes
router.get('/tutor/sessions', auth, getTutorSessions);

// Admin routes
router.get('/admin/sessions', auth, getAllSessions);

module.exports = router; 