// backend/src/routes/appointments.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all appointments (with optional filters and joins)
router.get('/', async (req, res) => {
  const { date, professional_id } = req.query;
  try {
    let query = db('appointments')
      .select(
        'appointments.*',
        'clients.name as client_name',
        'services.name as service_name'
      )
      .leftJoin('clients', 'appointments.client_id', 'clients.id')
      .leftJoin('services', 'appointments.service_id', 'services.id')
      .orderBy('appointments.date', 'asc')
      .orderBy('appointments.start_time', 'asc');

    if (date) {
      query = query.where('appointments.date', date);
    }
    if (professional_id) {
      query = query.where('appointments.professional_id', professional_id);
    }

    const appointments = await query;
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Create appointment (with conflict validation)
router.post('/', async (req, res) => {
  const { client_id, professional_id, service_id, date, start_time, end_time, duration_minutes, value, status, notes } = req.body;
  
  try {
    // Check for overlaps
    const overlapping = await db('appointments')
      .where('professional_id', professional_id)
      .andWhere('date', date)
      .andWhere(function() {
        this.where('start_time', '<', end_time)
            .andWhere('end_time', '>', start_time);
      })
      .whereNotIn('status', ['cancelado', 'faltou'])
      .first();

    if (overlapping) {
      return res.status(400).json({ message: 'O profissional já possui um agendamento nesse horário.' });
    }

    const [id] = await db('appointments').insert({ client_id, professional_id, service_id, date, start_time, end_time, duration_minutes, value, status, notes });
    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

module.exports = router;
