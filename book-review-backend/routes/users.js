/* eslint-disable no-undef */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const saltRounds = 10;

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // If there is no token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If the token is invalid or expired
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const userExists = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, hashedPassword);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create and sign a JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details by ID
router.get('/userpage/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  // Ensure the user can only access their own data
  if (parseInt(userId) !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const user = db.prepare('SELECT id, username, plan_to_read_books FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/read_books', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  if (parseInt(userId) !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const readBooks = db.prepare('SELECT * FROM read_books WHERE user_id = ?').all(userId);
    res.status(200).json(readBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a book to plan_to_read_books
router.post('/:id/plan_to_read_books', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { book_id } = req.body;

  // Ensure the user can only modify their own data
  if (parseInt(userId) !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const user = db.prepare('SELECT plan_to_read_books FROM users WHERE id = ?').get(userId);
    const planToReadBooks = JSON.parse(user.plan_to_read_books || '[]');

    // Check if the book is already in the plan_to_read_books list
    if (planToReadBooks.includes(book_id)) {
      return res.status(400).json({ error: 'Book already in plan to read list' });
    }

    planToReadBooks.push(book_id);

    db.prepare('UPDATE users SET plan_to_read_books = ? WHERE id = ?')
      .run(JSON.stringify(planToReadBooks), userId);

    res.status(200).json({ message: 'Book added to plan to read list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a book to read_books
router.post('/:id/read_books', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { book_id, rating, date_started, date_finished, review } = req.body;

  // Ensure the user can only modify their own data
  if (parseInt(userId) !== req.user.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const stmt = db.prepare('INSERT INTO read_books (user_id, book_id, rating, date_started, date_finished, review) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(userId, book_id, rating, date_started, date_finished, review);
    res.status(201).json({ message: 'Read book entry added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
