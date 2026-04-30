// backend/src/routes/clients.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List clients (paginated)
router.get('/', async (req, res) => {
  try {
    const clients = await db('clients').select('*');
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching clients' });
  }
});

// Create client
router.post('/', async (req, res) => {
  const { name, phone, whatsapp, email, birthdate, address, notes, preferences, allergies } = req.body;
  try {
    const [id] = await db('clients').insert({ name, phone, whatsapp, email, birthdate, address, notes, preferences, allergies });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating client' });
  }
});

module.exports = router;
