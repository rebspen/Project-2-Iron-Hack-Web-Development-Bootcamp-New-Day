'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  gartitude: [{
    body1: String,
    body2: String,
    body3: String
  }],
  great: [{
    body1: String,
    body2: String,
    body3: String
  }],
  affirmation : String,
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model('MornPost', schema);
