const express = require('express');
const multer = require('multer');
const CarouselImage = require('../models/CarouselImage'); 

const router = express.Router();

// Multer - konfigurace úložiště
const storage = multer.memoryStorage(); 

const upload = multer({ storage });

// Endpoint pro nahrávání obrázků
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const newImage = new CarouselImage({
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
    const images = await CarouselImage.find();
    res.status(200).json(images.map(image => ({
      url: image.image ? `data:${image.contentType};base64,${image.image.toString('base64')}` : null,
      contentType: image.contentType,
    })));
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    res.status(500).json({ message: 'Chyba při načítání obrázků.' });
  }
});

// Endpoint pro mazání obrázků
router.delete('/:id', async (req, res) => {
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
