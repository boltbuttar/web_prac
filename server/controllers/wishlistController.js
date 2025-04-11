const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ student: req.user._id })
      .populate('tutor', 'firstName lastName email subjects hourlyRate city profilePicture');

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist'
    });
  }
};

// Add tutor to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { tutorId } = req.body;

    // Check if tutor exists
    const tutor = await User.findOne({ _id: tutorId, role: 'tutor' });
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    // Check if already in wishlist
    let wishlistItem = await Wishlist.findOne({
      student: req.user._id,
      tutor: tutorId
    });

    if (wishlistItem) {
      return res.status(400).json({
        success: false,
        message: 'Tutor already in wishlist'
      });
    }

    // Add to wishlist
    wishlistItem = await Wishlist.create({
      student: req.user._id,
      tutor: tutorId
    });

    await wishlistItem.populate('tutor', 'firstName lastName email subjects hourlyRate city profilePicture');

    res.status(201).json({
      success: true,
      data: wishlistItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist'
    });
  }
};

// Remove tutor from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const result = await Wishlist.findOneAndDelete({
      student: req.user._id,
      tutor: tutorId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist'
    });
  }
}; 