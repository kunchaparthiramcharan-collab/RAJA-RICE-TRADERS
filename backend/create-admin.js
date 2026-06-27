const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { db } = require('./config/db');

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

  try {
    // Check if user already exists
    console.log('⏳ Connecting to Database and checking user status...');
    const existsRes = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(username) = ?',
      args: [username.toLowerCase()]
    });

    if (existsRes.rows.length > 0) {
      console.error(`❌ Error: Admin user "${username}" already exists.`);
      process.exit(1);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newId = 'user_' + Date.now();
    await db.execute({
      sql: 'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      args: [newId, username, hashedPassword]
    });

    console.log(`\n🎉 Success: Admin "${username}" registered successfully in SQLite/Turso!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
};

createAdmin();
