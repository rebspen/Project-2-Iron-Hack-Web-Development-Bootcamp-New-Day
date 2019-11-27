'use strict';


const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const Post = require('./../models/post');
const { Router } = require('express');
const express = require('express');
const router = new Router();
const uploader = require('../middleware/upload.js');

//---------------MAP
router.get('/', (req, res, next) => {
  //find random post
  Post.count().exec(function (err, count) {
    // Get a random entry
    const random = Math.floor(Math.random() * count)
    // Again query all users but only fetch one offset by our random #
    Post.findOne().skip(random).exec(
      function (err, result) {
        console.log("result", result,result._id) 
        res.render("index", {result})
      })
  })  
});









//----------------------------

//Sign In
router.get('/sign-in', (req, res, next) => {
  const userId = req.session.user;
  if(req.session.user){
    res.redirect(`/${userId}`);
  } else {
    res.render('auth/sign-in');}
  });

router.post('/auth/sign-in', (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  // Find a user with an email that corresponds to the one
  // inserted by the user in the sign in form
  User.findOne({ email })
    .then(user => {
      if (!user) {
      return Promise.reject(new Error("There is no user with that email. Please try again"));

      } else if (user.status == "Pending") {
        // If no user was found, return a rejection with an error
        // that will be sent to the error handler at the end of the promise chain
        return Promise.reject(new Error("You have not verified your email. Please Verify"));
      } else {
        // If there is an user,
        // save their ID to an auxiliary variable
        userId = user._id;
        // Compare the password with the salt + hash stored in the user document
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        // If they match, the user has successfully been signed up
        req.session.user = userId;
        res.redirect(`/${userId}`);
      } else {
        // If they don't match, reject with an error message
        return Promise.reject(new Error('Wrong password. Please try again.'));
      }
    })
    .catch(error => {
      next(error);
    });
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

router.post('/auth/sign-up', uploader.single('profile'), (req, res, next) => {
  const { name, email, password, location, theme} = req.body;
  const imgName = req.file.url;
  const imgPath = req.file.originalname;
  let token = '';
  const generateId = length => {
    const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
  };
  generateId(12);
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
      from: `New Day App<${process.env.EMAIL}>`,
      to: req.body.email,
      subject: 'Nice to meet you! Please verify your email to use the New Day app',
      //text: `http://localhost:3000/auth/confirm/${token}`,
      
      html: `
      <style></style>
      <div style="background-colour: yellow"> 
      <h1 style="color:  #779FA1; font-size: 50px; text-align: center">Welcome To The New Day App</h1>    
      <h2 style="color: #5C7457; font-size: 40px; text-align: center"><strong>Please verify your email by clicking <a href="http://localhost:3000/confirm/${token}">here</a></h2
      </div>
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
    .then(user => { 
      req.session.user = user._id; 
      res.redirect(`/${user._id}`);
    })
    .catch(error => {
      next(error); 
    });
  });
  
  //Sign Out 
  router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

//auto signout after quote

router.get('/auto-signout', (req, res, next) => {
  req.session.destroy();
  res.render('auth/auto-signout');
});

  module.exports = router;