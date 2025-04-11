const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    max: 480, // 8 hours in minutes
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'completed', 'cancelled'],
    default: 'available',
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
});

// Indexes for better query performance
sessionSchema.index({ tutor: 1, date: 1 });
sessionSchema.index({ student: 1, date: 1 });
sessionSchema.index({ status: 1, date: 1 });

// Virtual for end time
sessionSchema.virtual('endTime').get(function() {
  const [hours, minutes] = this.startTime.split(':');
  const startDate = new Date(this.date);
  startDate.setHours(parseInt(hours), parseInt(minutes), 0);
  const endDate = new Date(startDate.getTime() + this.duration * 60000);
  return endDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
});

// Method to check if session is available
sessionSchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Method to check if session is in the past
sessionSchema.methods.isPast = function() {
  const now = new Date();
  const sessionDate = new Date(this.date);
  sessionDate.setHours(...this.startTime.split(':'));
  return sessionDate < now;
};

// Method to check if session can be cancelled
sessionSchema.methods.canBeCancelled = function() {
  return !this.isPast() && this.status !== 'cancelled';
};

// Pre-save middleware to validate date and time
sessionSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isModified('startTime')) {
    const sessionDate = new Date(this.date);
    const [hours, minutes] = this.startTime.split(':');
    sessionDate.setHours(parseInt(hours), parseInt(minutes), 0);

    if (sessionDate < new Date()) {
      next(new Error('Session date and time must be in the future'));
      return;
    }
  }
  next();
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session; 