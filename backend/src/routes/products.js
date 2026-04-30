// backend/src/routes/products.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all products
router.get('/', async (req, res) => {
  try {
    const products = await db('products').select('*');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  const { name, category, brand, type, cost_price, sale_price, stock_quantity, min_stock, unit, supplier, expiration } = req.body;
  try {
    const [id] = await db('products').insert({ name, category, brand, type, cost_price, sale_price, stock_quantity, min_stock, unit, supplier, expiration });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
});

module.exports = router;
