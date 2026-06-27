const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Premium', 'Standard', 'Super Premium', 'Economy', 'Other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  packageSizes: {
    type: [String], // e.g. ["5kg", "10kg", "25kg", "50kg"]
    default: ["25kg"]
  },
  imageUrl: {
    type: String,
    default: ""
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
