const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

const router = express.Router();

// Registrace admin účtu
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: 'Admin account created' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});

// Přihlášení admina
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

// Chráněná routa
router.get('/protected', auth, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;