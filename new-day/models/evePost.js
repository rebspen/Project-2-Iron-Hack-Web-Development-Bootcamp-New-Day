'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    today: [{
      body1: String,
      body2: String,
      body3: String
    }],
    better: String,
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

module.exports = mongoose.model('EvePost', schema);
