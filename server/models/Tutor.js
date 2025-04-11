const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png'
  },
  subjects: [{
    type: String,
    required: true
  }],
  hourlyRate: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  availability: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  teachingPreferences: {
    online: {
      type: Boolean,
      default: true
    },
    inPerson: {
      type: Boolean,
      default: true
    },
    location: {
      type: String,
      required: function() {
        return this.teachingPreferences.inPerson;
      }
    }
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tutor', tutorSchema); 