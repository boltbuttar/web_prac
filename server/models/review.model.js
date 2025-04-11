const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

// Indexes for better query performance
reviewSchema.index({ session: 1 }, { unique: true });
reviewSchema.index({ tutor: 1 });
reviewSchema.index({ student: 1 });

// Pre-save middleware to ensure one review per session
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existingReview = await this.constructor.findOne({ session: this.session });
    if (existingReview) {
      next(new Error('Review already exists for this session'));
      return;
    }
  }
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 