const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    required: true
  },
  grade: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  education: {
    type: String,
    required: function() {
      return this.role === 'tutor';
    }
  },
  experience: {
    type: String,
    required: function() {
      return this.role === 'tutor';
    }
  },
  bio: {
    type: String,
    required: function() {
      return this.role === 'tutor';
    }
  },
  subjects: [{
    type: String,
    required: function() {
      return this.role === 'tutor';
    }
  }],
  hourlyRate: {
    type: Number,
    required: function() {
      return this.role === 'tutor';
    }
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
    type: {
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
          return this.teachingPreferences && this.teachingPreferences.inPerson;
        }
      }
    },
    required: function() {
      return this.role === 'tutor';
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 