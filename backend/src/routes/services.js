// backend/src/routes/services.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all services
router.get('/', async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

// Create a new service
router.post('/', async (req, res) => {
  const { name, category, description, price, duration_minutes, commission_rate } = req.body;
  try {
    const [id] = await db('services').insert({ name, category, description, price, duration_minutes, commission_rate });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating service' });
  }
});

module.exports = router;
