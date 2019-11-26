'use strict';

const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');

const User = require('./../models/user');

const routeGuard = require('./../middleware/route-guard');

router.get('/profile', routeGuard, (req, res, next) => {
  const userId = req.session.user;
  console.log("HEEERRREE", userId);
  res.redirect(`/${userId}`);
});

router.get('/:userId', routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  let user;
  User.findById(userId)
    .then(document => {
      user = document;
      return Post.find({ author: userId }).populate('author');
    })
    .then(posts => {
      res.render('profile', { user, posts });
    })
    .catch(error => {
      next(error);
    });
});


//EDITING USER INFORMATION 


  router.get('/:userId/edit', routeGuard, (req, res, next) => {
    const userId = req.params.userId;
    let user;
    User.findById(userId)
    .then(post => {
      res.render('profile-edit', { post });
    })
    .catch(error => {
      next(error);
    });
  });
  
  router.post('/:userId/edit', routeGuard, (req, res, next) => {
    const userId = req.params.userId;
    User.findOneAndUpdate({_id: userId}, {
      name: req.body.name,
      location: req.body.location,
      imgPath: req.file.originalname,
      imgName: req.file.url,
      theme: req.body.theme
    })
      .then(result => { 
      console.log(result)
      res.redirect(`/${userId}`)
      })
        .catch(error => {
          next(error);
        });
      });
    

module.exports = router;
