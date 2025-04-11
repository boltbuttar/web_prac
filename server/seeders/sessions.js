const mongoose = require('mongoose');
const Session = require('../models/Session');
const User = require('../models/User');

const seedSessions = async () => {
  try {
    // Get some existing users
    const tutors = await User.find({ role: 'tutor' });
    const students = await User.find({ role: 'student' });

    if (tutors.length === 0 || students.length === 0) {
      console.log('No tutors or students found. Please run user seeder first.');
      return;
    }

    // Clear existing sessions
    await Session.deleteMany({});

    // Create sample sessions
    const sessions = [
      {
        tutor: tutors[0]._id,
        student: students[0]._id,
        subject: 'Mathematics',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        price: tutors[0].hourlyRate,
        status: 'pending',
        location: 'online',
        notes: 'Algebra basics'
      },
      {
        tutor: tutors[0]._id,
        student: students[0]._id,
        subject: 'Physics',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        duration: 90,
        price: tutors[0].hourlyRate * 1.5,
        status: 'confirmed',
        location: 'in-person',
        notes: 'Mechanics review'
      }
    ];

    await Session.insertMany(sessions);
    console.log('Sessions seeded successfully');
  } catch (error) {
    console.error('Error seeding sessions:', error);
  }
};

module.exports = seedSessions; 