const mongoose = require('mongoose');

const tutorSearchSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchFilters: {
    subject: String,
    city: String,
    priceRange: {
      min: Number,
      max: Number
    },
    rating: Number,
    availability: Boolean
  },
  results: [{
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tutor',
      required: true
    },
    matchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TutorSearch', tutorSearchSchema); 