const mongoose = require('mongoose');

let isMockDB = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI is not set. Falling back to Mock In-Memory Database.');
    isMockDB = true;
    return;
  }

  try {
    // Set shorter timeout for local connections so it fails fast and triggers mock fallback if DB is not running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully.');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️ Falling back to Mock In-Memory Database.');
    isMockDB = true;
  }
};

const getDbStatus = () => isMockDB;

module.exports = { connectDB, getDbStatus };
