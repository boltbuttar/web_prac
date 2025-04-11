const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  saveSearchResults,
  getSearchHistory,
  getSearchResults
} = require('../controllers/tutorSearchController');

// All routes require authentication
router.use(auth);

// Save search results
router.post('/', saveSearchResults);

// Get student's search history
router.get('/history', getSearchHistory);

// Get specific search results
router.get('/:id', getSearchResults);

module.exports = router; 