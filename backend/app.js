const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const carouselImageRoutes = require('./routes/CarouselImageRoutes');
const carouselTextRoutes = require('./routes/carouselTextRoutes');
const ProgramImagesRoutes = require('./routes/ProgramImagesRoutes');
const eventLocationTextRoutes = require('./routes/EventLocationTextRoutes');
const eventRulesTextRoutes = require('./routes/EventRulesTextRoutes');
const EventRulesImagesRoutes = require('./routes/EventRulesImagesRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://merweekend.cz'], // Povolit pouze tyto domény
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '50mb' })); // Middleware pro zpracování JSON těla požadavku s limitem 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Middleware pro zpracování URL-encoded těla požadavku s limitem 50MB

// Použití rout
app.use('/api/auth', authRoutes);
app.use('/api/about/images', carouselImageRoutes);
app.use('/api/Program/images', ProgramImagesRoutes);
app.use('/api/about/text', carouselTextRoutes);
app.use('/api/eventLocation', eventLocationTextRoutes);
app.use('/api/eventRules', eventRulesTextRoutes);
app.use('/api/eventRules/images', EventRulesImagesRoutes);

// Statická složka pro obrázky
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});