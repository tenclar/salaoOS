// backend/src/routes/appointments.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all appointments (basic)
router.get('/', async (req, res) => {
  try {
    const appointments = await db('appointments').select('*');
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Create appointment (basic, no conflict validation yet)
router.post('/', async (req, res) => {
  const { client_id, professional_id, service_id, date, start_time, end_time, duration_minutes, value, status, notes } = req.body;
  try {
    const [id] = await db('appointments').insert({ client_id, professional_id, service_id, date, start_time, end_time, duration_minutes, value, status, notes });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

module.exports = router;
