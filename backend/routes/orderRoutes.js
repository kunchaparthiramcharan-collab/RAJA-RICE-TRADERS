const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../config/db');

// Helper to format SQLite order row for frontend consumption
const formatOrderRow = (row) => {
  if (!row) return null;
  return {
    _id: row.id, // Map SQLite id to _id so frontend code works unmodified
    id: row.id,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    products: JSON.parse(row.products),
    status: row.status,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// @route   GET /api/orders
// @desc    Get all orders/inquiries (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const ordersRes = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
    const ordersList = ordersRes.rows.map(formatOrderRow);
    res.json(ordersList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/my-inquiries
// @desc    Get logged in customer's inquiries
router.get('/my-inquiries', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'User details not found in token' });
    }

    const emailLower = req.user.email.toLowerCase();
    
    const ordersRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE LOWER(customerEmail) = ? ORDER BY created_at DESC',
      args: [emailLower]
    });

    const userOrders = ordersRes.rows.map(formatOrderRow);
    res.json(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving your inquiries' });
  }
});

// @route   POST /api/orders
// @desc    Submit a new order/inquiry (Public)
router.post('/', async (req, res) => {
  const { customerName, customerPhone, customerEmail, products, message } = req.body;

  if (!customerName || !customerPhone || !customerEmail) {
    return res.status(400).json({ message: 'Please provide name, phone and email contact details' });
  }

  try {
    const newId = 'ord_' + Date.now();
    const finalProducts = JSON.stringify(products || []);
    const finalStatus = 'Pending';
    const finalMessage = message || '';

    await db.execute({
      sql: `INSERT INTO orders (id, customerName, customerPhone, customerEmail, products, status, message) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [newId, customerName, customerPhone, customerEmail, finalProducts, finalStatus, finalMessage]
    });

    const orderRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [newId]
    });

    return res.status(201).json(formatOrderRow(orderRes.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting inquiry' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const checkRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [id]
    });

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await db.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [status, id]
    });

    const updatedRes = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [id]
    });

    return res.json(formatOrderRow(updatedRes.rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;
