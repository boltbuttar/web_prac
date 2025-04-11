const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');

dotenv.config();

const tutorProfiles = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    city: 'Lahore',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    hourlyRate: 1500,
    education: 'MSc in Mathematics',
    experience: '5 years of teaching experience',
    bio: 'Experienced tutor specializing in advanced mathematics and sciences',
    availability: {
      monday: { start: '14:00', end: '20:00' },
      tuesday: { start: '14:00', end: '20:00' },
      wednesday: { start: '14:00', end: '20:00' },
      thursday: { start: '14:00', end: '20:00' },
      friday: { start: '14:00', end: '20:00' },
      saturday: { start: '10:00', end: '18:00' },
      sunday: { start: '10:00', end: '18:00' }
    },
    rating: 4.8,
    totalReviews: 25,
    totalSessions: 150,
    totalEarnings: 225000
  },
  {
    firstName: 'Sarah',
    lastName: 'Khan',
    email: 'sarah.khan@example.com',
    phone: '2345678901',
    city: 'Karachi',
    subjects: ['English', 'Literature', 'Writing'],
    hourlyRate: 1200,
    education: 'MA in English Literature',
    experience: '3 years of teaching experience',
    bio: 'Passionate English tutor helping students improve their writing and communication skills',
    availability: {
      monday: { start: '09:00', end: '15:00' },
      tuesday: { start: '09:00', end: '15:00' },
      wednesday: { start: '09:00', end: '15:00' },
      thursday: { start: '09:00', end: '15:00' },
      friday: { start: '09:00', end: '15:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: { start: '09:00', end: '13:00' }
    },
    rating: 4.9,
    totalReviews: 18,
    totalSessions: 120,
    totalEarnings: 144000
  },
  {
    firstName: 'Ahmed',
    lastName: 'Raza',
    email: 'ahmed.raza@example.com',
    phone: '3456789012',
    city: 'Islamabad',
    subjects: ['Computer Science', 'Programming', 'Web Development'],
    hourlyRate: 2000,
    education: 'MS in Computer Science',
    experience: '4 years of teaching experience',
    bio: 'Software engineer turned tutor, helping students master programming concepts',
    availability: {
      monday: { start: '16:00', end: '22:00' },
      tuesday: { start: '16:00', end: '22:00' },
      wednesday: { start: '16:00', end: '22:00' },
      thursday: { start: '16:00', end: '22:00' },
      friday: { start: '16:00', end: '22:00' },
      saturday: { start: '14:00', end: '20:00' },
      sunday: { start: '14:00', end: '20:00' }
    },
    rating: 4.7,
    totalReviews: 32,
    totalSessions: 200,
    totalEarnings: 400000
  },
  {
    firstName: 'Fatima',
    lastName: 'Ali',
    email: 'fatima.ali@example.com',
    phone: '4567890123',
    city: 'Rawalpindi',
    subjects: ['Biology', 'Chemistry', 'Medical Sciences'],
    hourlyRate: 1800,
    education: 'MBBS, MD in Biochemistry',
    experience: '6 years of teaching experience',
    bio: 'Medical professional helping students understand complex biological concepts',
    availability: {
      monday: { start: '10:00', end: '16:00' },
      tuesday: { start: '10:00', end: '16:00' },
      wednesday: { start: '10:00', end: '16:00' },
      thursday: { start: '10:00', end: '16:00' },
      friday: { start: '10:00', end: '16:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '10:00', end: '14:00' }
    },
    rating: 4.9,
    totalReviews: 28,
    totalSessions: 180,
    totalEarnings: 324000
  },
  {
    firstName: 'Muhammad',
    lastName: 'Hassan',
    email: 'muhammad.hassan@example.com',
    phone: '5678901234',
    city: 'Faisalabad',
    subjects: ['Economics', 'Business Studies', 'Finance'],
    hourlyRate: 1600,
    education: 'MBA in Finance',
    experience: '4 years of teaching experience',
    bio: 'Business professional helping students understand economic concepts and financial management',
    availability: {
      monday: { start: '11:00', end: '17:00' },
      tuesday: { start: '11:00', end: '17:00' },
      wednesday: { start: '11:00', end: '17:00' },
      thursday: { start: '11:00', end: '17:00' },
      friday: { start: '11:00', end: '17:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '11:00', end: '15:00' }
    },
    rating: 4.6,
    totalReviews: 22,
    totalSessions: 140,
    totalEarnings: 224000
  },
  {
    firstName: 'Aisha',
    lastName: 'Malik',
    email: 'aisha.malik@example.com',
    phone: '6789012345',
    city: 'Multan',
    subjects: ['History', 'Political Science', 'Social Studies'],
    hourlyRate: 1300,
    education: 'MA in History',
    experience: '3 years of teaching experience',
    bio: 'History enthusiast helping students understand the past and its impact on the present',
    availability: {
      monday: { start: '12:00', end: '18:00' },
      tuesday: { start: '12:00', end: '18:00' },
      wednesday: { start: '12:00', end: '18:00' },
      thursday: { start: '12:00', end: '18:00' },
      friday: { start: '12:00', end: '18:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: '10:00', end: '14:00' }
    },
    rating: 4.7,
    totalReviews: 20,
    totalSessions: 130,
    totalEarnings: 169000
  },
  {
    firstName: 'Usman',
    lastName: 'Khalid',
    email: 'usman.khalid@example.com',
    phone: '7890123456',
    city: 'Peshawar',
    subjects: ['Urdu', 'Arabic', 'Islamic Studies'],
    hourlyRate: 1400,
    education: 'MA in Islamic Studies',
    experience: '5 years of teaching experience',
    bio: 'Experienced language and Islamic studies tutor helping students master Urdu and Arabic',
    availability: {
      monday: { start: '13:00', end: '19:00' },
      tuesday: { start: '13:00', end: '19:00' },
      wednesday: { start: '13:00', end: '19:00' },
      thursday: { start: '13:00', end: '19:00' },
      friday: { start: '13:00', end: '19:00' },
      saturday: { start: '11:00', end: '15:00' },
      sunday: { start: '11:00', end: '15:00' }
    },
    rating: 4.8,
    totalReviews: 24,
    totalSessions: 160,
    totalEarnings: 224000
  }
];

const seedTutorData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    for (const profile of tutorProfiles) {
      // Check if tutor already exists
      const existingUser = await User.findOne({ email: profile.email });
      if (existingUser) {
        console.log(`Tutor ${profile.firstName} ${profile.lastName} already exists, skipping...`);
        continue;
      }

      // Create tutor user
      const tutorUser = await User.create({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        password: hashedPassword,
        phone: profile.phone,
        city: profile.city,
        role: 'tutor',
        hourlyRate: profile.hourlyRate,
        subjects: profile.subjects,
        education: profile.education,
        experience: profile.experience,
        bio: profile.bio,
        availability: profile.availability,
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: profile.city
        }
      });

      // Create tutor profile
      const tutorProfile = await Tutor.create({
        user: tutorUser._id,
        subjects: profile.subjects,
        hourlyRate: profile.hourlyRate,
        education: profile.education,
        experience: profile.experience,
        bio: profile.bio,
        availability: profile.availability,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        totalSessions: profile.totalSessions,
        totalEarnings: profile.totalEarnings,
        teachingPreferences: {
          online: true,
          inPerson: true,
          location: profile.city
        }
      });

      // Create sample sessions for each tutor
      const sessions = [
        {
          tutor: tutorUser._id,
          student: new mongoose.Types.ObjectId(),
          subject: profile.subjects[0],
          date: new Date('2024-03-30T14:00:00'),
          duration: 2,
          price: profile.hourlyRate,
          status: 'completed',
          location: 'Online',
          notes: `Sample session for ${profile.subjects[0]}`,
          rating: 5,
          review: 'Excellent teaching style and very patient'
        },
        {
          tutor: tutorUser._id,
          student: new mongoose.Types.ObjectId(),
          subject: profile.subjects[1],
          date: new Date('2024-03-31T15:00:00'),
          duration: 1.5,
          price: profile.hourlyRate,
          status: 'confirmed',
          location: 'Online',
          notes: `Sample session for ${profile.subjects[1]}`
        },
        {
          tutor: tutorUser._id,
          student: new mongoose.Types.ObjectId(),
          subject: profile.subjects[2],
          date: new Date('2024-04-01T16:00:00'),
          duration: 2,
          price: profile.hourlyRate,
          status: 'pending',
          location: 'Online',
          notes: `Sample session for ${profile.subjects[2]}`
        }
      ];

      await Session.insertMany(sessions);
      console.log(`Created tutor profile for ${profile.firstName} ${profile.lastName}`);
    }

    console.log('All tutor data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedTutorData(); 