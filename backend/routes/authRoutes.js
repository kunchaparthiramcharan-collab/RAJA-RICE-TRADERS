const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const { getDbStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    let user;

    if (getDbStatus()) {
      // Use mock database
      user = mockDb.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    } else {
      // Use MongoDB database
      user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

      // Auto-seed default admins on first login attempt if database is fresh
      const targetUser = username.toLowerCase();
      if (!user && (targetUser === 'admin' || targetUser === 'rajaricetraders01@gmail.com')) {
        const adminCount = await User.countDocuments();
        if (adminCount === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('admin123', salt);
          
          // Seed standard admin
          const standardAdmin = new User({
            username: 'admin',
            password: hashedPassword
          });
          await standardAdmin.save();

          // Seed Gmail admin
          const gmailAdmin = new User({
            username: 'rajaricetraders01@gmail.com',
            password: hashedPassword
          });
          await gmailAdmin.save();

          console.log('🌱 Automatically seeded default admin users (admin & rajaricetraders01@gmail.com) into live MongoDB.');
          
          // Re-query user
          user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT Token
    const payload = { id: user._id || user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id || user.id,
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

    if (getDbStatus()) {
      // Check if user exists in mock
      const exists = mockDb.users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        username,
        password: hashedPassword
      };
      mockDb.users.push(newUser);
      
      return res.status(201).json({
        message: 'Admin registered successfully (Mock DB)',
        user: { id: newUser._id, username: newUser.username }
      });
    } else {
      // Check if user exists in MongoDB
      const exists = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
      if (exists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = new User({
        username,
        password: hashedPassword
      });

      await newUser.save();
      return res.status(201).json({
        message: 'Admin registered successfully',
        user: { id: newUser._id, username: newUser.username }
      });
    }
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

    if (getDbStatus()) {
      // Check if email already exists in mock
      const exists = mockDb.customers.some(c => c.email.toLowerCase() === emailLower);
      if (exists) {
        return res.status(400).json({ message: 'Customer email already registered' });
      }

      const newCust = {
        _id: 'cust_' + Date.now(),
        name,
        phone,
        email: emailLower,
        password: hashedPassword
      };
      mockDb.customers.push(newCust);

      return res.status(201).json({
        message: 'Customer registered successfully (Mock DB)',
        user: { id: newCust._id, name: newCust.name, email: newCust.email }
      });
    } else {
      // Mongoose DB check
      const exists = await Customer.findOne({ email: emailLower });
      if (exists) {
        return res.status(400).json({ message: 'Customer email already registered' });
      }

      const newCust = new Customer({
        name,
        phone,
        email: emailLower,
        password: hashedPassword
      });

      await newCust.save();
      return res.status(201).json({
        message: 'Customer registered successfully',
        user: { id: newCust._id, name: newCust.name, email: newCust.email }
      });
    }
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
    let customer;
    const emailLower = email.toLowerCase();

    if (getDbStatus()) {
      customer = mockDb.customers.find(c => c.email.toLowerCase() === emailLower);
    } else {
      customer = await Customer.findOne({ email: emailLower });
    }

    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { 
      id: customer._id || customer.id, 
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
