const mongoose = require('mongoose');

// MongoDB schéma
const ProgramImageSchema = new mongoose.Schema({
  image: Buffer, // Binární data obrázku
  contentType: String, // Typ souboru (např. image/jpeg)
});

const  ProgramImage = mongoose.model('ProgramImgs', ProgramImageSchema);

module.exports =  ProgramImage;
