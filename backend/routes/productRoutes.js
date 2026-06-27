const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { getDbStatus } = require('../config/db');
const mockDb = require('../config/mockDb');

// Helper to generate IDs for mock data
const generateMockId = () => 'prod_' + Math.random().toString(36).substr(2, 9);

// @route   GET /api/products
// @desc    Get all products (with optional filtering and search)
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  try {
    let resultProducts = [];

    if (getDbStatus()) {
      // Fetch from Mock DB
      resultProducts = [...mockDb.products];
    } else {
      // Fetch from MongoDB
      const count = await Product.countDocuments();
      if (count === 0) {
        // Strip custom string _id for clean Mongoose auto-ObjectId generation
        const productsToSeed = mockDb.products.map(({ _id, ...rest }) => rest);
        await Product.insertMany(productsToSeed);
        console.log('🌱 Automatically seeded default products catalog into live MongoDB.');
      }
      resultProducts = await Product.find().lean();
    }

    // Filter by category
    if (category && category !== 'All') {
      resultProducts = resultProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search query
    if (search) {
      const searchLower = search.toLowerCase();
      resultProducts = resultProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(resultProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let product;

    if (getDbStatus()) {
      product = mockDb.products.find(p => p._id === id);
    } else {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching product details' });
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
router.post('/', auth, async (req, res) => {
  const { name, description, category, price, packageSizes, imageUrl, inStock, stockQuantity } = req.body;

  if (!name || !description || !category || price === undefined) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    if (getDbStatus()) {
      const newProduct = {
        _id: generateMockId(),
        name,
        description,
        category,
        price: Number(price),
        packageSizes: packageSizes || ["25kg"],
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
        inStock: inStock !== undefined ? inStock : true,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDb.products.push(newProduct);
      return res.status(201).json(newProduct);
    } else {
      const newProduct = new Product({
        name,
        description,
        category,
        price: Number(price),
        packageSizes: packageSizes || ["25kg"],
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
        inStock: inStock !== undefined ? inStock : true,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0
      });
      const savedProduct = await newProduct.save();
      return res.status(201).json(savedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { name, description, category, price, packageSizes, imageUrl, inStock, stockQuantity } = req.body;
  const { id } = req.params;

  try {
    if (getDbStatus()) {
      const index = mockDb.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updated = {
        ...mockDb.products[index],
        name: name !== undefined ? name : mockDb.products[index].name,
        description: description !== undefined ? description : mockDb.products[index].description,
        category: category !== undefined ? category : mockDb.products[index].category,
        price: price !== undefined ? Number(price) : mockDb.products[index].price,
        packageSizes: packageSizes !== undefined ? packageSizes : mockDb.products[index].packageSizes,
        imageUrl: imageUrl !== undefined ? imageUrl : mockDb.products[index].imageUrl,
        inStock: inStock !== undefined ? inStock : mockDb.products[index].inStock,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : mockDb.products[index].stockQuantity,
        updatedAt: new Date()
      };
      
      mockDb.products[index] = updated;
      return res.json(updated);
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, category, price, packageSizes, imageUrl, inStock, stockQuantity },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    if (getDbStatus()) {
      const index = mockDb.products.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }
      mockDb.products.splice(index, 1);
      return res.json({ message: 'Product removed successfully' });
    } else {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      await product.deleteOne();
      return res.json({ message: 'Product removed successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
