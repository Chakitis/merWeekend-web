const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Uživatel nenalezen.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nesprávné heslo.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('token', token);
    const newToken = new Token({ token, userId: user._id });
    await newToken.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error('Chyba při přihlášení:', error);
    res.status(500).json({ message: 'Chyba při přihlášení.' });
  }
});

module.exports = router;