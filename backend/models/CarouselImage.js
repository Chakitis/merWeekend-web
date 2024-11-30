const mongoose = require('mongoose');

// MongoDB schéma
const CarouselImageSchema = new mongoose.Schema({
  image: Buffer, // Binární data obrázku
  contentType: String, // Typ souboru (např. image/jpeg)
});

const CarouselImage = mongoose.model('carouselimgs', CarouselImageSchema);

module.exports = CarouselImage;
