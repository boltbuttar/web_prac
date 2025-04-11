const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} = require('../controllers/wishlist.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.post('/tutors/:tutorId', addToWishlist);
router.delete('/tutors/:tutorId', removeFromWishlist);
router.get('/', getWishlist);
router.delete('/', clearWishlist);

module.exports = router; 