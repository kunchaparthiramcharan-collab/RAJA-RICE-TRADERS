// Load environment variables FIRST before any other requires
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

// Connect to Database (async, non-blocking startup)
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ Database connection failed on startup:', err.message);
  }
})();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Root endpoint for verification
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Raja Rice Traders API" });
});

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
