'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  location :{
    type : String,
    required: true,
    trim: true
  },
  imgName: String,
  imgPath: String,
  theme :{
    type: String,
    enum : ["Forest", "Ocean", "Space", "Pattern", "Beach"]
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model('User', schema);
