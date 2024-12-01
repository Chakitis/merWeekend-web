const mongoose = require('mongoose');

const CarouselTextSchema = new mongoose.Schema({
  text: { type: String},
});

const CarouselText = mongoose.model('CarouselText', CarouselTextSchema);

module.exports = CarouselText;