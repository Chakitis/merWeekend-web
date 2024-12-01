const express = require('express');
const mongoose = require('mongoose');
const CarouselText = require('../models/CarouselText');

const router = express.Router();

// Endpoint pro ukládání textu
router.post('/save', async (req, res) => {
  const { content } = req.body;

  try {
    const existingText = await CarouselText.findOne();
    if (existingText) {
      existingText.content = content;
      await existingText.save();
    } else {
      const newTextContent = new CarouselText({ content });
      await newTextContent.save();
    }
    res.status(200).json({ message: 'Text byl úspěšně uložen!' });
  } catch (error) {
    console.error('Chyba při ukládání textu:', error);
    res.status(500).json({ message: 'Chyba při ukládání textu.' });
  }
});

// Endpoint pro načítání textu
router.get('/', async (req, res) => {
  try {
    const textContent = await CarouselText.findOne();
    res.status(200).json(textContent);
  } catch (error) {
    console.error('Chyba při načítání textu:', error);
    res.status(500).json({ message: 'Chyba při načítání textu.' });
  }
});

module.exports = router;