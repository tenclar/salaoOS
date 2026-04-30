// backend/src/routes/professionals.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List professionals
router.get('/', async (req, res) => {
  try {
    const pros = await db('professionals').select('*');
    res.json(pros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching professionals' });
  }
});

// Create professional
router.post('/', async (req, res) => {
  const { name, phone, email, role, specialty, working_hours, commission_rate } = req.body;
  try {
    const [id] = await db('professionals').insert({ name, phone, email, role, specialty, working_hours, commission_rate });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating professional' });
  }
});

module.exports = router;
