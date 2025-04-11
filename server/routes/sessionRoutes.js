const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Session = require('../models/Session');
const User = require('../models/User');

// Get all sessions for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const sessions = await Session.find({
      $or: [
        { student: req.user._id },
        { tutor: req.user._id }
      ]
    })
    .populate('tutor', 'firstName lastName email profilePicture hourlyRate subjects')
    .populate('student', 'firstName lastName email')
    .sort({ date: 1 });

    res.json({
      success: true,
      data: sessions || []
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching sessions'
    });
  }
});

// Book a new session
router.post('/book', auth, async (req, res) => {
  try {
    const { tutorId, subject, date, duration, location, notes } = req.body;

    // Validate required fields
    if (!tutorId || !subject || !date || !duration || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if tutor exists and get their hourly rate
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Calculate price based on duration and tutor's hourly rate
    const price = (tutor.hourlyRate * duration) / 60;

    // Check for scheduling conflicts
    const sessionDate = new Date(date);
    const endTime = new Date(sessionDate.getTime() + duration * 60000);

    const conflictingSession = await Session.findOne({
      tutor: tutorId,
      status: { $ne: 'cancelled' },
      date: {
        $lt: endTime,
        $gt: sessionDate
      }
    });

    if (conflictingSession) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create new session
    const session = new Session({
      tutor: tutorId,
      student: req.user._id,
      subject,
      date: sessionDate,
      duration,
      price,
      location,
      notes,
      status: 'pending'
    });

    const newSession = await session.save();
    await newSession.populate([
      { path: 'tutor', select: 'firstName lastName email profilePicture hourlyRate subjects' },
      { path: 'student', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Session booked successfully',
      data: newSession
    });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update session status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Only allow tutor to update status
    if (session.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only tutors can update session status'
      });
    }

    // Validate status transition
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    session.status = req.body.status;
    const updatedSession = await session.save();
    await updatedSession.populate([
      { path: 'tutor', select: 'firstName lastName email profilePicture' },
      { path: 'student', select: 'firstName lastName email' }
    ]);

    res.json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Cancel a session
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Only allow student or tutor to cancel
    if (session.student.toString() !== req.user._id.toString() && 
        session.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this session'
      });
    }

    // Check cancellation time limit (24 hours before)
    const sessionTime = new Date(session.date).getTime();
    const now = new Date().getTime();
    const hoursUntilSession = (sessionTime - now) / (1000 * 60 * 60);

    if (hoursUntilSession < 24) {
      return res.status(400).json({
        success: false,
        message: 'Sessions can only be cancelled at least 24 hours before'
      });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add rating and review to a completed session
router.post('/:id/review', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed sessions'
      });
    }

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only students can leave reviews'
      });
    }

    // Validate rating
    if (!req.body.rating || req.body.rating < 1 || req.body.rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    session.rating = req.body.rating;
    session.review = req.body.review;
    const updatedSession = await session.save();

    // Update tutor's average rating
    const tutorSessions = await Session.find({
      tutor: session.tutor,
      status: 'completed',
      rating: { $exists: true }
    });

    const totalRating = tutorSessions.reduce((sum, s) => sum + s.rating, 0);
    const averageRating = totalRating / tutorSessions.length;

    await User.findByIdAndUpdate(session.tutor, {
      $set: { rating: averageRating.toFixed(1) }
    });

    res.json({
      success: true,
      data: updatedSession
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Check tutor's availability for a specific date
router.get('/availability/:tutorId', auth, async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;

    // Get tutor's working hours
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Get all booked sessions for that date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSessions = await Session.find({
      tutor: tutorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $ne: 'cancelled' }
    });

    // Generate available time slots (9 AM to 5 PM, 1-hour slots)
    const availableSlots = [];
    const workingHours = {
      start: 9,
      end: 17
    };

    // Create time slots
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);

      // Check if slot is already booked
      const isBooked = bookedSessions.some(session => {
        const sessionStart = new Date(session.date);
        const sessionEnd = new Date(sessionStart.getTime() + session.duration * 60000);
        return (
          (slotStart >= sessionStart && slotStart < sessionEnd) ||
          (new Date(slotStart.getTime() + 3600000) > sessionStart && 
           new Date(slotStart.getTime() + 3600000) <= sessionEnd)
        );
      });

      if (!isBooked) {
        availableSlots.push(slotStart);
      }
    }

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
});

module.exports = router; 