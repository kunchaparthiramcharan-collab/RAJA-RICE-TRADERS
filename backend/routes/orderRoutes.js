const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { getDbStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

const generateMockId = () => 'ord_' + Math.random().toString(36).substr(2, 9);

// @route   GET /api/orders
// @desc    Get all orders/inquiries (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    let ordersList = [];

    if (getDbStatus()) {
      ordersList = [...mockDb.orders];
      // Sort by newest first
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      ordersList = await Order.find().sort({ createdAt: -1 });
    }

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
    let userOrders = [];

    if (getDbStatus()) {
      userOrders = mockDb.orders.filter(o => o.customerEmail.toLowerCase() === emailLower);
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      userOrders = await Order.find({ customerEmail: emailLower }).sort({ createdAt: -1 });
    }

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
    if (getDbStatus()) {
      const newOrder = {
        _id: generateMockId(),
        customerName,
        customerPhone,
        customerEmail,
        products: products || [],
        status: 'Pending',
        message: message || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDb.orders.push(newOrder);
      return res.status(201).json(newOrder);
    } else {
      const newOrder = new Order({
        customerName,
        customerPhone,
        customerEmail,
        products: products || [],
        status: 'Pending',
        message: message || ''
      });
      const savedOrder = await newOrder.save();
      return res.status(201).json(savedOrder);
    }
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
    if (getDbStatus()) {
      const index = mockDb.orders.findIndex(o => o._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Order not found' });
      }

      mockDb.orders[index] = {
        ...mockDb.orders[index],
        status,
        updatedAt: new Date()
      };

      return res.json(mockDb.orders[index]);
    } else {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.json(updatedOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

module.exports = router;
