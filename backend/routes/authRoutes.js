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

module.exports = router;
