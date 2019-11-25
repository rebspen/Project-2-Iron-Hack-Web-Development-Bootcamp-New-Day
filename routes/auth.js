'use strict';


const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');

const { Router } = require('express');
const express = require('express');
const router = new Router();
const uploadCloud = require('../middleware/upload.js');

router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.get('/verified', (req, res, next) => {
  res.render('auth/verified');
});

//Sign Up
router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

router.post('/sign-up', uploadCloud.single('profile'), (req, res, next) => {
  const { name, email, password, location, theme} = req.body;
  const imgName = req.file.url;
  const imgPath = req.file.originalname;
  let token = '';
  const generateId = length => {
    const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
  };
  generateId(12)
  
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      // Now that we have the value of the hashed password,
      // create the user
      return User.create({
        name,
        email,
        passwordHash: hash,
        location,
        imgPath,
        imgName,
        confirmationCode: token,
        theme
      });
    })
    .then(user => {
      // User was securely created
      // Save it's ID to the session (we call this process serialization),
      // so that it can later be loaded from the database and
      // bound to the request with req.body (deserialization)
      req.session.user = user._id;
      res.redirect('/verified');
    }) .then(
      transporter.sendMail({
        from: `IH Test <${process.env.EMAIL}>`,
        to: req.body.email,
        subject: 'Please verify your email',
        //text: `http://localhost:3000/auth/confirm/${token}`,
        html: `
          <style>
          
          </style>
          <h1 style="color: green">Welcome to the New Day App!<h1>
          <a href ="http://localhost:3000/confirm/${token}">Click here</a>
          <p><strong>Please verify your email by clicking on the link</strong> <em></em></p>
        `
      }))
    .catch(error => {
      // If there was an error in the promise chain,
      // send to the error handler
      next(error);
    });
});

router.get('/confirm/:code', (req, res, next) => {
  const code = req.params.code;
  User.findOneAndUpdate({confirmationCode : code}, {status: "Active"})
  .then (user => { 
  res.render('/', {user});
  })
  .catch(error => {
    next(error); 
  });
});

module.exports = router;