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

// Get single professional
router.get('/:id', async (req, res) => {
  try {
    const pro = await db('professionals').where({ id: req.params.id }).first();
    if (!pro) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json(pro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching professional' });
  }
});

// Update professional
router.put('/:id', async (req, res) => {
  const { name, phone, email, role, specialty, working_hours, commission_rate, active } = req.body;
  try {
    const updatedCount = await db('professionals')
      .where({ id: req.params.id })
      .update({ 
        name, 
        phone, 
        email, 
        role, 
        specialty, 
        working_hours, 
        commission_rate,
        active,
        updated_at: db.fn.now()
      });
    
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json({ message: 'Professional updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating professional' });
  }
});

// Delete professional
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await db('professionals').where({ id: req.params.id }).del();
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json({ message: 'Professional deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting professional' });
  }
});

module.exports = router;
