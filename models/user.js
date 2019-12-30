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
  imageName: {
    type: String,
    default: "http://res.cloudinary.com/lglg0101/image/upload/v1574959534/new-day/t1jqqrml1mkwdkbxhzst.png"
  },
  imgPath: {
    type:String,
    Default: "ruby.png"
  },
  theme :{
    type: String,
    enum : ["forest", "ocean", "space", "pattern", "beach", "none"], 
    default: "none" 
  }, 
  confirmationCode: String,
  
  status: {
    type: String,
    enum: ["Active", "Pending"],
    default: "Pending"
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model('User', schema);
