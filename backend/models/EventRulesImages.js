const mongoose = require('mongoose');

// MongoDB schéma
const EventRulesImageSchema = new mongoose.Schema({
  image: Buffer, // Binární data obrázku
  contentType: String, // Typ souboru (např. image/jpeg)
});

const EventRulesImage = mongoose.model('EventRulesImage', EventRulesImageSchema);

module.exports = EventRulesImage;
