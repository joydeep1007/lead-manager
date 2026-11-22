const express = require('express');
const db = require('../db');

const router = express.Router();

// Defined before /:id routes so Express does not treat "stats" as an id param
router.get('/stats', (req, res) => {
  res.json({ message: 'TODO' });
});

router.get('/', (req, res) => {
  res.json({ message: 'TODO' });
});

router.post('/', (req, res) => {
  res.json({ message: 'TODO' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'TODO' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'TODO' });
});

module.exports = router;
