const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../config/db');

// Helper to format SQLite product row to the format expected by React frontend
const formatProductRow = (row) => {
  if (!row) return null;
  return {
    _id: row.id, // Map SQLite id to _id so frontend code works unmodified
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: row.price,
    packageSizes: JSON.parse(row.packageSizes),
    imageUrl: row.imageUrl,
    inStock: row.inStock === 1,
    stockQuantity: row.stockQuantity,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// @route   GET /api/products
// @desc    Get all products (with optional filtering and search)
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  try {
    const productsRes = await db.execute('SELECT * FROM products ORDER BY category ASC, name ASC');
    let resultProducts = productsRes.rows.map(formatProductRow);

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
    const productRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });

    const product = formatProductRow(productRes.rows[0]);

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
    const newId = 'prod_' + Date.now();
    const finalPackageSizes = JSON.stringify(packageSizes || ["25kg"]);
    const finalImageUrl = imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600";
    const finalInStock = (inStock !== undefined ? inStock : true) ? 1 : 0;
    const finalStockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : 0;

    await db.execute({
      sql: `INSERT INTO products (id, name, description, category, price, packageSizes, imageUrl, inStock, stockQuantity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [newId, name, description, category, Number(price), finalPackageSizes, finalImageUrl, finalInStock, finalStockQuantity]
    });

    const productRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [newId]
    });

    return res.status(201).json(formatProductRow(productRes.rows[0]));
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
    // Check if exists
    const checkRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });

    const existingProduct = checkRes.rows[0];
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const finalName = name !== undefined ? name : existingProduct.name;
    const finalDescription = description !== undefined ? description : existingProduct.description;
    const finalCategory = category !== undefined ? category : existingProduct.category;
    const finalPrice = price !== undefined ? Number(price) : existingProduct.price;
    const finalPackageSizes = packageSizes !== undefined ? JSON.stringify(packageSizes) : existingProduct.packageSizes;
    const finalImageUrl = imageUrl !== undefined ? imageUrl : existingProduct.imageUrl;
    
    let finalInStock;
    if (inStock !== undefined) {
      finalInStock = inStock ? 1 : 0;
    } else {
      finalInStock = existingProduct.inStock;
    }

    const finalStockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : existingProduct.stockQuantity;

    await db.execute({
      sql: `UPDATE products 
            SET name = ?, description = ?, category = ?, price = ?, packageSizes = ?, imageUrl = ?, inStock = ?, stockQuantity = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
      args: [finalName, finalDescription, finalCategory, finalPrice, finalPackageSizes, finalImageUrl, finalInStock, finalStockQuantity, id]
    });

    const updatedRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });

    return res.json(formatProductRow(updatedRes.rows[0]));
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
    const checkRes = await db.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id]
    });

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id]
    });

    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;
