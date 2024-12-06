const express = require('express');
const EventLocationText = require('../models/EventLocationText');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();

// Endpoint pro ukládání textu
router.post('/text', authMiddleware, async (req, res) => {
  const { content } = req.body;

  try {
    const existingText = await EventLocationText.findOne();
    if (existingText) {
      existingText.content = content;
      await existingText.save();
    } else {
      const newTextContent = new EventLocationText({ content });
      await newTextContent.save();
    }
    res.status(200).json({ message: 'Text byl úspěšně uložen!' });
  } catch (error) {
    console.error('Chyba při ukládání textu:', error);
    res.status(500).json({ message: 'Chyba při ukládání textu.' });
  }
});

// Endpoint pro načítání textu
router.get('/text', async (req, res) => {
  try {
    const textContent = await EventLocationText.findOne();
    res.status(200).json(textContent);
  } catch (error) {
    console.error('Chyba při načítání textu:', error);
    res.status(500).json({ message: 'Chyba při načítání textu.' });
  }
});

module.exports = router;