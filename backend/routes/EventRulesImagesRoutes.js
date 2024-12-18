const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const EventRulesImages = require('../models/EventRulesImages');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer - konfigurace úložiště
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

// Endpoint pro nahrávání obrázků
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const newImage = new EventRulesImages({
      image: req.file.buffer, // Binární data souboru
      contentType: req.file.mimetype,
    });
    await newImage.save();
    res.status(200).json({ message: 'Obrázek byl úspěšně uložen!', contentType: newImage.contentType, image: newImage.image.toString('base64') });
  } catch (error) {
    console.error('Chyba při ukládání obrázku:', error);
    res.status(500).json({ message: 'Chyba při ukládání obrázku.' });
  }
});

// Endpoint pro načítání obrázků
router.get('/', async (req, res) => {
  try {
    const images = await EventRulesImages.find();
    res.status(200).json(images.map(image => ({
      url: image.image ? `data:${image.contentType};base64,${image.image.toString('base64')}` : null,
      contentType: image.contentType,
      id: image._id,
    })));
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    res.status(500).json({ message: 'Chyba při načítání obrázků.' });
  }
});

// Endpoint pro mazání obrázků
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  // Zkontrolujte, zda je ID platný ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Neplatný formát ID' });
  }

  try {
    const result = await EventRulesImages.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: 'Obrázek nenalezen' });
    }
    res.status(200).send({ message: 'Obrázek byl úspěšně smazán' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Chyba při mazání obrázku' });
  }
});

module.exports = router;
