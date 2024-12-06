const mongoose = require('mongoose');

const EventLocationTextSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
}, { collection: 'EventLocationText' });

const EventLocationText = mongoose.model('EventLocationText', EventLocationTextSchema);

module.exports = EventLocationText;