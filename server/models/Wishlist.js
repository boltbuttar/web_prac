const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a student can only have a tutor once in their wishlist
wishlistSchema.index({ student: 1, tutor: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema); 