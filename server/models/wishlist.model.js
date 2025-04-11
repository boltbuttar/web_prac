const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  tutors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true,
});

// Index for better query performance
wishlistSchema.index({ student: 1 });

// Pre-save middleware to ensure unique tutors
wishlistSchema.pre('save', function(next) {
  this.tutors = [...new Set(this.tutors)];
  next();
});

// Method to add a tutor to wishlist
wishlistSchema.methods.addTutor = function(tutorId) {
  if (!this.tutors.some(t => t.toString() === tutorId.toString())) {
    this.tutors.push(tutorId);
    return true;
  }
  return false;
};

// Method to remove a tutor from wishlist
wishlistSchema.methods.removeTutor = function(tutorId) {
  this.tutors = this.tutors.filter(t => t.toString() !== tutorId.toString());
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist; 