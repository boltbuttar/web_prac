const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const {
  getDashboardData,
  getTutorProfile,
  updateTutorProfile,
  updateProfilePicture,
  getTutorSessions,
  updateSessionStatus,
  getTutorEarnings,
  getEarningsSummary,
  getAvailableTutors,
  getTutorById
} = require('../controllers/tutorController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Tutor routes are working',
    timestamp: new Date().toISOString()
  });
});

// Public routes for students
router.get('/', getAvailableTutors);
router.get('/:id', getTutorById);

// Protected routes for tutors
router.get('/dashboard', auth, getDashboardData);
router.get('/profile', auth, getTutorProfile);
router.put('/profile', auth, updateTutorProfile);
router.post('/profile/picture', auth, upload.single('profilePicture'), updateProfilePicture);
router.get('/sessions', auth, getTutorSessions);
router.put('/sessions/:sessionId/status', auth, updateSessionStatus);
router.get('/earnings', auth, getTutorEarnings);
router.get('/earnings/summary', auth, getEarningsSummary);

module.exports = router; 