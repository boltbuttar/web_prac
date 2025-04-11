const User = require('../models/user.model');
const Session = require('../models/session.model');
const Review = require('../models/review.model');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get user statistics
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'tutor' }),
      Session.countDocuments(),
      Review.countDocuments()
    ]);

    res.json({
      totalStudents: stats[0],
      totalTutors: stats[1],
      totalSessions: stats[2],
      totalReviews: stats[3]
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.role = req.body.role;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete associated sessions and reviews
    await Promise.all([
      Session.deleteMany({ tutor: user._id }),
      Session.deleteMany({ student: user._id }),
      Review.deleteMany({ user: user._id })
    ]);

    await user.remove();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all sessions
exports.getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .populate('tutor', 'name email')
      .populate('student', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Get all reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 