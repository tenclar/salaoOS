// backend/src/routes/products.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all products
router.get('/', async (req, res) => {
  try {
    const products = await db('products').select('*').orderBy('id', 'desc');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  const { name, category, brand, type, cost_price, sale_price, stock_quantity, min_stock, unit, supplier, expiration, active } = req.body;
  try {
    const [id] = await db('products').insert({
      name,
      category,
      brand,
      type,
      cost_price,
      sale_price,
      stock_quantity,
      min_stock,
      unit,
      supplier,
      expiration,
      active
    });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, brand, type, cost_price, sale_price, stock_quantity, min_stock, unit, supplier, expiration, active } = req.body;
  
  try {
    const updated = await db('products')
      .where({ id })
      .update({
        name,
        category,
        brand,
        type,
        cost_price,
        sale_price,
        stock_quantity,
        min_stock,
        unit,
        supplier,
        expiration,
        active,
        updated_at: db.fn.now()
      });

    if (updated) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db('products').where({ id }).del();
    if (deleted) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
