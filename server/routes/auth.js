const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(body) {
  const { email, password } = body && typeof body === 'object' ? body : {};
  const errors = [];

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('invalid email');
  }

  if (typeof password !== 'string' || password.length === 0) {
    errors.push('password is required');
  }

  return {
    errors,
    normalizedEmail: typeof email === 'string' ? email.trim().toLowerCase() : '',
    password,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { errors, normalizedEmail, password } = validateCredentials(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = db
      .prepare("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, datetime('now'))")
      .run(normalizedEmail, passwordHash);

    const user = db
      .prepare('SELECT id, email, created_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);

    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { errors, normalizedEmail, password } = validateCredentials(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
