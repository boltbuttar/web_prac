const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create student
    const studentSalt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('Test123!', studentSalt);
    
    const student = new User({
      firstName: 'Test',
      lastName: 'Student',
      email: 'student@test.com',
      password: studentPassword,
      phone: '03001234567',
      city: 'Lahore',
      role: 'student',
      grade: '10'
    });

    await student.save();
    console.log('Student created successfully');

    // Create tutor
    const tutorSalt = await bcrypt.genSalt(10);
    const tutorPassword = await bcrypt.hash('Test123!', tutorSalt);
    
    const tutor = new User({
      firstName: 'Test',
      lastName: 'Tutor',
      email: 'tutor@test.com',
      password: tutorPassword,
      phone: '03001234568',
      city: 'Lahore',
      role: 'tutor',
      education: "Bachelor's in Computer Science",
      experience: '5 years',
      hourlyRate: 1000,
      bio: 'Experienced tutor with expertise in Mathematics and Computer Science',
      subjects: ['Mathematics', 'Computer Science'],
      availability: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '17:00' },
        sunday: { start: '09:00', end: '17:00' }
      },
      teachingPreferences: {
        online: true,
        inPerson: true,
        location: 'Lahore, Pakistan'
      }
    });

    await tutor.save();
    console.log('Tutor created successfully');

    console.log('Test users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers(); 