const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  const args = process.argv.slice(2);
  const username = args[0];
  const password = args[1];

  if (!username || !password) {
    console.error('❌ Error: Please provide both username and password.');
    console.log('Usage: node create-admin.js <username> <password>');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI is not defined in the backend .env file.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user already exists
    const exists = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (exists) {
      console.log(`ℹ️ Admin user "${username}" already exists. Updating password...`);
      exists.password = hashedPassword;
      await exists.save();
      console.log(`\n🎉 Success: Admin "${username}" password updated successfully!`);
      mongoose.connection.close();
      process.exit(0);
    }

    // Save user
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    console.log(`\n🎉 Success: Admin "${username}" registered successfully!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (mongoose.connection) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

createAdmin();
