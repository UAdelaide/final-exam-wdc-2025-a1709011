const express = require('express');
const router = express.Router();
const db = require('../models/db');
const session = require('express-session');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});





const connection = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'user_profile'
});

connection.connect();


router.post('/login', async function (req, res, next) {
  const { username, password, recaptcha } = req.body;

  try {
    const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
    const captchaRes = await axios.post(
      verifyURL,
      null,
      { params: { secret: RECAPTCHA_SECRET, response: recaptcha } }
    );

    if (!captchaRes.data.success) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed' });
    }
  } catch (err) {
    console.error('reCAPTCHA error:', err.message);
    return res.status(500).json({ error: 'reCAPTCHA verification error' });
  }

  const sql = 'SELECT * FROM Users WHERE username = ?';
  connection.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const storedPassword = user.password;
    const type = user.password_type || 'plain';

    let isValid = false;

    if (type === 'plain') {
      isValid = (storedPassword === password);
    } else if (type === 'argon2') {
      try {
        isValid = await argon2.verify(storedPassword, password);
      } catch (err) {
        isValid = false;
      }
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (type === 'plain') {
      try {
        const hash = await argon2.hash(password);
        connection.query('UPDATE Users SET password = ?, password_type = ? WHERE user_id = ?', [hash, 'argon2', user.user_id]);
      } catch (err) {
        console.error('Hashing upgrade error:', err);
      }
    }

    req.session.user = {
      message: 'Login successful',
      user_id: user.user_id,
      username: user.username,
      image: user.picture_url,
      email: user.email,
      mobile: user.mobile,
      country: user.country,
      state: user.state,
      postcode: user.postcode,
      city: user.city,
      street_name: user.street_name,
      street_number: user.street_number,
      role: user.role
    };

    req.session.save(() => {
      res.json({ message: 'Login successful' });
    });
  });
});

router.get('/me', (req, res) => {
  console.log('Session:', req.session);
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});






module.exports = router;