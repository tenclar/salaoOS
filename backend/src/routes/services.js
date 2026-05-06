// backend/src/routes/services.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all services
router.get('/', async (req, res) => {
  try {
    const services = await db('services').select('*').orderBy('id', 'asc');
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

// Create a new service
router.post('/', async (req, res) => {
  const { name, category, description, price, duration_minutes, commission_rate, active } = req.body;
  try {
    const [id] = await db('services').insert({ 
      name, 
      category, 
      description, 
      price: price || 0, 
      duration_minutes: duration_minutes || 0, 
      commission_rate: commission_rate || 0,
      active: active !== undefined ? active : true
    });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating service' });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, duration_minutes, commission_rate, active } = req.body;
  try {
    const updatedCount = await db('services')
      .where({ id })
      .update({
        name,
        category,
        description,
        price,
        duration_minutes,
        commission_rate,
        active,
        updated_at: db.fn.now()
      });
    
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating service' });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await db('services').where({ id }).del();
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

module.exports = router;
