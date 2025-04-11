const Session = require('../models/session.model');
const { validationResult } = require('express-validator');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

// Create a new session
exports.createSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array());
    }

    const session = new Session({
      ...req.body,
      tutor: req.user._id,
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// Get a single session by ID
exports.getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('tutor', 'name email')
      .populate('student', 'name email');

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Check if user has permission to view the session
    if (
      session.tutor._id.toString() !== req.user._id.toString() &&
      session.student?._id?.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenError('Not authorized to view this session');
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Update a session
exports.updateSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError(errors.array());
    }

    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Check if user has permission to update the session
    if (
      session.tutor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenError('Not authorized to update this session');
    }

    // Prevent updating certain fields
    const updates = { ...req.body };
    delete updates.tutor;
    delete updates.student;
    delete updates.status;

    Object.assign(session, updates);
    await session.save();

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Delete a session
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Check if user has permission to delete the session
    if (
      session.tutor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenError('Not authorized to delete this session');
    }

    await session.remove();
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all sessions for a student
exports.getStudentSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ student: req.user._id })
      .populate('tutor', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Get all sessions for a tutor
exports.getTutorSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ tutor: req.user._id })
      .populate('student', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Get all sessions (admin only)
exports.getAllSessions = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to view all sessions');
    }

    const sessions = await Session.find()
      .populate('tutor', 'name email')
      .populate('student', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
}; 