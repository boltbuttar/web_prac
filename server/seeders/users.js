const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test users
    const users = [
      {
        firstName: 'John',
        lastName: 'Student',
        email: 'student@example.com',
        password: hashedPassword,
        role: 'student',
        phone: '1234567890',
        city: 'Karachi',
        grade: '10th Grade'
      },
      {
        firstName: 'Sarah',
        lastName: 'Teacher',
        email: 'tutor1@example.com',
        password: hashedPassword,
        role: 'tutor',
        phone: '0987654321',
        city: 'Lahore',
        subjects: ['Mathematics', 'Physics'],
        hourlyRate: 1500,
        education: 'MSc in Mathematics',
        experience: '5 years of teaching experience',
        bio: 'Passionate about making math and physics easy to understand',
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: 'Lahore'
        },
        availability: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' }
        }
      },
      {
        firstName: 'Ahmed',
        lastName: 'Khan',
        email: 'tutor2@example.com',
        password: hashedPassword,
        role: 'tutor',
        phone: '1122334455',
        city: 'Islamabad',
        subjects: ['Chemistry', 'Biology'],
        hourlyRate: 1200,
        education: 'PhD in Chemistry',
        experience: '8 years of teaching experience',
        bio: 'Specialized in making complex concepts simple',
        teachingPreferences: {
          online: true,
          inPerson: false
        },
        availability: {
          monday: { start: '10:00', end: '18:00' },
          wednesday: { start: '10:00', end: '18:00' },
          friday: { start: '10:00', end: '18:00' }
        }
      },
      {
        firstName: 'Maria',
        lastName: 'Ali',
        email: 'tutor3@example.com',
        password: hashedPassword,
        role: 'tutor',
        phone: '5544332211',
        city: 'Karachi',
        subjects: ['English', 'History'],
        hourlyRate: 1000,
        education: 'MA in English Literature',
        experience: '3 years of teaching experience',
        bio: 'Helping students master language and literature',
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: 'Karachi'
        },
        availability: {
          tuesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          saturday: { start: '10:00', end: '15:00' }
        }
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers; 