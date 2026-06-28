const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userRes = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(username) = ?',
      args: [username.toLowerCase()]
    });
    
    const user = userRes.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT Token
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new admin (initially or locally)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user exists in SQLite
    const existsRes = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(username) = ?',
      args: [username.toLowerCase()]
    });

    if (existsRes.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newId = 'user_' + Date.now();
    await db.execute({
      sql: 'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      args: [newId, username, hashedPassword]
    });

    return res.status(201).json({
      message: 'Admin registered successfully',
      user: { id: newId, username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/customer/register
// @desc    Register a new customer account
router.post('/customer/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Please provide all details (name, phone, email, password)' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailLower = email.toLowerCase();

    // Mongoose DB check in SQLite
    const existsRes = await db.execute({
      sql: 'SELECT * FROM customers WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    if (existsRes.rows.length > 0) {
      return res.status(400).json({ message: 'Customer email already registered' });
    }

    const newId = 'cust_' + Date.now();
    await db.execute({
      sql: 'INSERT INTO customers (id, name, phone, email, password) VALUES (?, ?, ?, ?, ?)',
      args: [newId, name, phone, emailLower, hashedPassword]
    });

    return res.status(201).json({
      message: 'Customer registered successfully',
      user: { id: newId, name, email: emailLower }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during customer registration' });
  }
});

// @route   POST /api/auth/customer/login
// @desc    Authenticate customer & get token
router.post('/customer/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const emailLower = email.toLowerCase();
    const customerRes = await db.execute({
      sql: 'SELECT * FROM customers WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    const customer = customerRes.rows[0];

    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { 
      id: customer.id, 
      name: customer.name, 
      email: customer.email,
      phone: customer.phone,
      role: 'customer' 
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: payload
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during customer login' });
  }
});

const { sendOTP } = require('../config/emailService');

// @route   POST /api/auth/forgot-password
// @desc    Generate and send password reset OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please enter your registered email address' });
  }

  try {
    const emailLower = email.toLowerCase();

    // 1. Check if email belongs to a customer
    const customerRes = await db.execute({
      sql: 'SELECT * FROM customers WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    // 2. Check if email belongs to an admin user
    const adminRes = await db.execute({
      sql: 'SELECT * FROM users WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    const isCustomer = customerRes.rows.length > 0;
    const isAdmin = adminRes.rows.length > 0;

    if (!isCustomer && !isAdmin) {
      return res.status(404).json({ message: 'This email is not registered with any account' });
    }

    // 3. Generate 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins from now

    // 4. Save to password_resets table (upsert behavior)
    const resetId = 'reset_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    // First, clean up any existing reset codes for this email
    await db.execute({
      sql: 'DELETE FROM password_resets WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    await db.execute({
      sql: 'INSERT INTO password_resets (id, email, code, expires_at) VALUES (?, ?, ?, ?)',
      args: [resetId, emailLower, code, expiresAt]
    });

    // 5. Send Email
    const emailRes = await sendOTP(emailLower, code);

    return res.json({
      message: 'Verification code sent to your email address.',
      mock: emailRes.mock ? true : false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while requesting password reset' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'Please enter all fields (email, code, and new password)' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const emailLower = email.toLowerCase();

    // 1. Verify OTP code in password_resets
    const resetRes = await db.execute({
      sql: 'SELECT * FROM password_resets WHERE LOWER(email) = ? AND code = ?',
      args: [emailLower, code.trim()]
    });

    const resetRecord = resetRes.rows[0];

    if (!resetRecord) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // 2. Check expiration
    const expiresAt = new Date(resetRecord.expires_at);
    if (expiresAt < new Date()) {
      // Clean up expired record
      await db.execute({
        sql: 'DELETE FROM password_resets WHERE id = ?',
        args: [resetRecord.id]
      });
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // 3. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update password in the database (checks both tables)
    // Update Customer
    await db.execute({
      sql: 'UPDATE customers SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = ?',
      args: [hashedPassword, emailLower]
    });

    // Update Admin
    await db.execute({
      sql: 'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE LOWER(email) = ?',
      args: [hashedPassword, emailLower]
    });

    // 5. Clean up reset record
    await db.execute({
      sql: 'DELETE FROM password_resets WHERE LOWER(email) = ?',
      args: [emailLower]
    });

    return res.json({ message: 'Password reset successfully. You can now login with your new password.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
});

module.exports = router;
