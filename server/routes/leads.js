const express = require('express');
const db = require('../db');

const router = express.Router();

// Defined before /:id routes so Express does not treat "stats" as an id param
router.get('/stats', (req, res) => {
  res.json({ message: 'TODO' });
});

router.get('/', (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      const pattern = `%${search}%`;
      params.push(pattern, pattern);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM leads ${whereClause} ORDER BY created_at DESC`;
    const leads = db.prepare(sql).all(...params);

    res.json(leads);
  } catch (err) {
    next(err);
  }
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
