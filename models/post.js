'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  gratitude: String,
  great: String,
  affirmation : String,
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  today: String,
  better: String
},
{
  timestamps: true
}
);

module.exports = mongoose.model('Post', schema);
