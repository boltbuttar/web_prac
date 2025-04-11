const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedUsers = require('./users');
const seedSessions = require('./sessions');

// Load environment variables
dotenv.config();

const runSeeders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Run seeders in sequence
    console.log('Running user seeder...');
    await seedUsers();
    
    console.log('Running session seeder...');
    await seedSessions();

    console.log('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

runSeeders(); 