const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Drop the users collection
    try {
      await db.collection('users').drop();
      console.log('Dropped users collection');
    } catch (error) {
      console.log('Collection does not exist or other error:', error.message);
    }

    // Create the users collection without the username index
    await db.createCollection('users');
    console.log('Created users collection');

    // Create only the email index
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Created email index');

    console.log('Database fixed successfully');
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

fixDatabase(); 