// backend/src/routes/roles.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

// List all roles
router.get('/', async (req, res) => {
  try {
    const roles = await db('roles').select('*');
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

// Get single role
router.get('/:id', async (req, res) => {
  try {
    const role = await db('roles').where({ id: req.params.id }).first();
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching role' });
  }
});

// Create role
router.post('/', async (req, res) => {
  const { name, description, permissions } = req.body;
  try {
    const [id] = await db('roles').insert({ 
      name, 
      description, 
      permissions: JSON.stringify(permissions || {}) 
    });
    res.status(201).json({ id, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating role' });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  const { name, description, permissions } = req.body;
  try {
    const updated = await db('roles')
      .where({ id: req.params.id })
      .update({ 
        name, 
        description, 
        permissions: JSON.stringify(permissions || {}) 
      });
      
    if (updated) {
      res.json({ message: 'Role updated successfully' });
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating role' });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db('roles').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Role deleted successfully' });
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting role' });
  }
});

module.exports = router;
