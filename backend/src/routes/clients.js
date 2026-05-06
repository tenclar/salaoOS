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

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await db('clients').where({ id: req.params.id }).first();
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching client' });
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

// Update client
router.put('/:id', async (req, res) => {
  const { name, phone, whatsapp, email, birthdate, address, notes, preferences, allergies } = req.body;
  try {
    const updated = await db('clients')
      .where({ id: req.params.id })
      .update({ name, phone, whatsapp, email, birthdate, address, notes, preferences, allergies });
      
    if (updated) {
      res.json({ message: 'Client updated successfully' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('clients').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

module.exports = router;
