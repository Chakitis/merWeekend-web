const express = require('express');
const CarouselImage = require('../models/CarouselImage'); // Import modelu Image

const router = express.Router();

// Endpoint pro nahrávání obrázků
router.post('/upload', async (req, res) => {
  try {
    if (!req.body.image || !req.body.contentType) {
      return res.status(400).send('No file uploaded.');
    }

    const imageBuffer = Buffer.from(req.body.image, 'base64');

    const newImage = new CarouselImage({
      image: imageBuffer, // Binární data souboru
      contentType: req.body.contentType, // MIME typ obrázku
    });
    await newImage.save(); // Uložení do MongoDB

    res.status(200).json({ contentType: newImage.contentType, image: newImage.image });
  } catch (error) {
    console.error('Chyba při ukládání obrázku:', error);
    res.status(500).json({ message: 'Chyba při ukládání obrázku.' });
  }
});

// Endpoint pro načítání obrázků
router.get('/images', async (req, res) => {
  try {
    const images = await CarouselImage.find(); // Načtení všech obrázků z MongoDB
    res.status(200).json(images);
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    res.status(500).json({ message: 'Chyba při načítání obrázků.' });
  }
});

// Endpoint pro smazání obrázku
router.delete('/images/:id', async (req, res) => {
  try {
    const image = await CarouselImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Obrázek nebyl nalezen.' });
    }

    await image.remove();
    res.status(200).json({ message: 'Obrázek byl smazán.' });
  } catch (error) {
    console.error('Chyba při mazání obrázku:', error);
    res.status(500).json({ message: 'Chyba při mazání obrázku.' });
  }
});

module.exports = router;