const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
require('dotenv').config();

const createTutors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const tutors = [
      {
        firstName: 'Ahmed',
        lastName: 'Khan',
        email: 'ahmed.khan@educonnect.com',
        phone: '03001234569',
        city: 'Karachi',
        education: "Master's in Mathematics",
        experience: '8 years',
        hourlyRate: 1500,
        bio: 'Experienced mathematics tutor with expertise in advanced calculus and statistics',
        subjects: ['Mathematics', 'Statistics', 'Physics'],
        availability: {
          monday: { start: '10:00', end: '18:00' },
          tuesday: { start: '10:00', end: '18:00' },
          wednesday: { start: '10:00', end: '18:00' },
          thursday: { start: '10:00', end: '18:00' },
          friday: { start: '10:00', end: '18:00' },
          saturday: { start: '10:00', end: '18:00' },
          sunday: { start: '10:00', end: '18:00' }
        },
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: 'Karachi, Pakistan'
        }
      },
      {
        firstName: 'Fatima',
        lastName: 'Ali',
        email: 'fatima.ali@educonnect.com',
        phone: '03001234570',
        city: 'Islamabad',
        education: "PhD in Computer Science",
        experience: '10 years',
        hourlyRate: 2000,
        bio: 'Senior software engineer turned tutor, specializing in programming and web development',
        subjects: ['Computer Science', 'Programming', 'Web Development'],
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
          location: 'Islamabad, Pakistan'
        }
      },
      {
        firstName: 'Muhammad',
        lastName: 'Hassan',
        email: 'muhammad.hassan@educonnect.com',
        phone: '03001234571',
        city: 'Lahore',
        education: "Master's in English Literature",
        experience: '6 years',
        hourlyRate: 1200,
        bio: 'Experienced English tutor with expertise in literature and academic writing',
        subjects: ['English', 'Literature', 'Writing'],
        availability: {
          monday: { start: '11:00', end: '19:00' },
          tuesday: { start: '11:00', end: '19:00' },
          wednesday: { start: '11:00', end: '19:00' },
          thursday: { start: '11:00', end: '19:00' },
          friday: { start: '11:00', end: '19:00' },
          saturday: { start: '11:00', end: '19:00' },
          sunday: { start: '11:00', end: '19:00' }
        },
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: 'Lahore, Pakistan'
        }
      },
      {
        firstName: 'Sara',
        lastName: 'Ahmed',
        email: 'sara.ahmed@educonnect.com',
        phone: '03001234572',
        city: 'Faisalabad',
        education: "Master's in Chemistry",
        experience: '7 years',
        hourlyRate: 1300,
        bio: 'Chemistry expert with experience in both academic and industrial research',
        subjects: ['Chemistry', 'Biology', 'Physics'],
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
          location: 'Faisalabad, Pakistan'
        }
      }
    ];

    for (const tutorData of tutors) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: tutorData.email });
      if (existingUser) {
        console.log(`User with email ${tutorData.email} already exists, skipping...`);
        continue;
      }

      // Create user
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('Test123!', salt);
      
      const user = new User({
        ...tutorData,
        password,
        role: 'tutor'
      });

      await user.save();
      console.log(`Created user: ${tutorData.firstName} ${tutorData.lastName}`);

      // Create tutor profile
      const tutor = new Tutor({
        user: user._id,
        subjects: tutorData.subjects,
        hourlyRate: tutorData.hourlyRate,
        education: tutorData.education,
        experience: tutorData.experience,
        bio: tutorData.bio,
        availability: tutorData.availability,
        teachingPreferences: tutorData.teachingPreferences,
        isActive: true
      });

      await tutor.save();
      console.log(`Created tutor profile for: ${tutorData.firstName} ${tutorData.lastName}`);
    }

    console.log('All tutors created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tutors:', error);
    process.exit(1);
  }
};

createTutors(); 