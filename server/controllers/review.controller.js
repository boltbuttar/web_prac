const Review = require('../models/review.model');
const Session = require('../models/session.model');
const { validationResult } = require('express-validator');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array());
    }

    // Check if session exists and is completed
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (session.status !== 'completed') {
      throw new BadRequestError('Can only review completed sessions');
    }

    // Check if user is the student who attended the session
    if (session.student.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Only the student who attended the session can leave a review');
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ session: req.params.sessionId });
    if (existingReview) {
      throw new BadRequestError('Review already exists for this session');
    }

    const review = new Review({
      ...req.body,
      session: req.params.sessionId,
      student: req.user._id,
      tutor: session.tutor,
    });

    await review.save();

    // Update session with review
    session.rating = req.body.rating;
    session.review = req.body.comment;
    await session.save();

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// Get a single review
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('student', 'name')
      .populate('tutor', 'name')
      .populate('session', 'subject date');

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// Update a review
exports.updateReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array());
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if user is the student who wrote the review
    if (review.student.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Not authorized to update this review');
    }

    // Update review
    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();

    // Update session review
    const session = await Session.findById(review.session);
    session.rating = req.body.rating;
    session.review = req.body.comment;
    await session.save();

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new NotFoundError('Review not found');
    }

    // Check if user is the student who wrote the review
    if (review.student.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Not authorized to delete this review');
    }

    // Remove review from session
    const session = await Session.findById(review.session);
    session.rating = undefined;
    session.review = undefined;
    await session.save();

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all reviews for a tutor
exports.getTutorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId })
      .populate('student', 'name')
      .populate('session', 'subject date')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get all reviews by a student
exports.getStudentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ student: req.params.studentId })
      .populate('tutor', 'name')
      .populate('session', 'subject date')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
}; 