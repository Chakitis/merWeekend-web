const mongoose = require('mongoose');

const CarouselTextSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
}, { collection: 'CarouselText' });

const CarouselText = mongoose.model('CarouselText', CarouselTextSchema);

module.exports = CarouselText;