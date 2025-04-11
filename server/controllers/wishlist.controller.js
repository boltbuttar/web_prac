const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// Add a tutor to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    // Check if tutor exists
    const tutor = await User.findById(req.params.tutorId);
    if (!tutor) {
      throw new NotFoundError('Tutor not found');
    }

    if (tutor.role !== 'tutor') {
      throw new BadRequestError('User is not a tutor');
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ student: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({
        student: req.user._id,
        tutors: [req.params.tutorId],
      });
    } else {
      // Check if tutor is already in wishlist
      if (wishlist.tutors.includes(req.params.tutorId)) {
        throw new BadRequestError('Tutor is already in wishlist');
      }
      wishlist.tutors.push(req.params.tutorId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// Remove a tutor from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ student: req.user._id });
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }

    const tutorIndex = wishlist.tutors.indexOf(req.params.tutorId);
    if (tutorIndex === -1) {
      throw new NotFoundError('Tutor not found in wishlist');
    }

    wishlist.tutors.splice(tutorIndex, 1);
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// Get wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ student: req.user._id })
      .populate('tutors', 'name email subjects hourlyRate rating');

    if (!wishlist) {
      return res.json({ tutors: [] });
    }

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ student: req.user._id });
    if (!wishlist) {
      throw new NotFoundError('Wishlist not found');
    }

    wishlist.tutors = [];
    await wishlist.save();

    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    next(error);
  }
}; 