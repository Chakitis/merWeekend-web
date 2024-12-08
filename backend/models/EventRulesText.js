const mongoose = require('mongoose');

const EventRulesTextSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
}, { collection: 'EventRulesText' });

const EventRulesText = mongoose.model('EventRulesText', EventRulesTextSchema);

module.exports = EventRulesText;