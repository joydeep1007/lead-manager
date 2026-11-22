const express = require('express');
const db = require('../db');
const validateLead = require('../middleware/validateLead');

const { LEAD_SOURCES, LEAD_STATUSES } = validateLead;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = express.Router();

// Defined before /:id routes so Express does not treat "stats" as an id param
router.get('/stats', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT status, COUNT(*) as count FROM leads GROUP BY status').all();
    const stats = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));

    for (const row of rows) {
      if (Object.prototype.hasOwnProperty.call(stats, row.status)) {
        stats[row.status] = row.count;
      }
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
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

router.post('/', validateLead, (req, res, next) => {
  try {
    const { name, email, phone = null, company = null, source, status } = req.body;

    const result = db
      .prepare(
        `INSERT INTO leads (name, email, phone, company, source, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
      .run(name.trim(), email.trim(), phone ?? null, company ?? null, source, status);

    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const errors = [];

    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
      errors.push('name is required');
    }
    if (body.email !== undefined && (typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email))) {
      errors.push('invalid email');
    }
    if (body.status !== undefined && !LEAD_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${LEAD_STATUSES.join(', ')}`);
    }
    if (body.source !== undefined && !LEAD_SOURCES.includes(body.source)) {
      errors.push(`source must be one of: ${LEAD_SOURCES.join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const allowedFields = ['name', 'email', 'phone', 'company', 'source', 'status'];
    const updates = [];
    const params = [];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field) && body[field] !== undefined) {
        updates.push(`${field} = ?`);
        const value =
          field === 'name' || field === 'email' ? body[field].trim() : body[field];
        params.push(value);
      }
    }

    updates.push("updated_at = datetime('now')");
    params.push(id);

    db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    const result = db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
