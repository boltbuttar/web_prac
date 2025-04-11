const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Apply auth middleware to all admin routes
router.use(auth);

// Get all users (admin only)
router.get('/users', checkRole('admin'), adminController.getAllUsers);

// Get user statistics (admin only)
router.get('/stats', checkRole('admin'), adminController.getStats);

// Update user role (admin only)
router.patch(
  '/users/:id/role',
  checkRole('admin'),
  [check('role').isIn(['student', 'tutor', 'admin'])],
  adminController.updateUserRole
);

// Delete user (admin only)
router.delete('/users/:id', checkRole('admin'), adminController.deleteUser);

// Get all sessions (admin only)
router.get('/sessions', checkRole('admin'), adminController.getAllSessions);

// Get all reviews (admin only)
router.get('/reviews', checkRole('admin'), adminController.getAllReviews);

// Delete review (admin only)
router.delete('/reviews/:id', checkRole('admin'), adminController.deleteReview);

module.exports = router; 