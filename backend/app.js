const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const authRoutes = require('./routes/authRoutes');
const CarouselImage = require('./models/CarouselImage'); // Import modelu Image

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://merweekend.cz'], // Povolit pouze tyto domény
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json()); // Middleware pro zpracování JSON těla požadavku

// Multer - konfigurace úložiště
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Cesta pro uložení obrázků
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint pro nahrávání obrázků
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const newImage = new CarouselImage({
      image: req.file.buffer, // Binární data souboru
      contentType: req.file.mimetype, // MIME typ obrázku
    });
    await newImage.save(); // Uložení do MongoDB

    res.status(200).json({ message: 'Obrázek byl úspěšně uložen!' });
  } catch (error) {
    console.error('Chyba při ukládání obrázku:', error);
    res.status(500).json({ message: 'Chyba při ukládání obrázku.' });
  }
});

// Endpoint pro získání všech obrázků
app.get('/images', async (req, res) => {
  try {
    const images = await CarouselImage.find(); // Načtení všech obrázků z MongoDB
    res.status(200).json(images);
  } catch (error) {
    console.error('Chyba při načítání obrázků:', error);
    res.status(500).json({ message: 'Chyba při načítání obrázků.' });
  }
});

// Statická složka pro obrázky
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Autentifikační routy (pro autentizaci)
app.use('/api/auth', authRoutes);

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
