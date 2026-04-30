// backend/src/routes/packages.js
const express = require('express');
const router = express.Router();

// Placeholder routes for package management (CRUD)
router.get('/', (req, res) => {
  res.json({ message: 'Packages endpoint (to be implemented)' });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create package (to be implemented)' });
});

module.exports = router;
