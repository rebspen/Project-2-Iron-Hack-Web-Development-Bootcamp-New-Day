'use strict';

const { Router } = require('express');
const router = new Router();
const Post = require('./../models/post');
const User = require('./../models/user');
const routeGuard = require('./../middleware/route-guard');
const uploader = require('../middleware/upload.js');


// ---------------MAP

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
// router.get('/', (req, res, next) => {
//   const userId = req.session.user;
//   res.render(`index`);
// });


router.get('/about', (req, res, next) => {
  res.render(`about`);
});


router.get('/profile', routeGuard, (req, res, next) => {
  const userId = req.session.user;
  res.redirect(`/${userId}`);
});

router.get('/:userId', routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  let user;
  User.findById(userId)
    .then(document => {
      user = document;
      return Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author');
    })
    .then(posts => {
      res.render('profile', { user, posts });
    })
    .catch(error => {
      next(error);
    });
});


//EDITING USER INFORMATION 
//general
  router.get('/:userId/edit', routeGuard, (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
      res.render('profile-edit', { user });
    })
    .catch(error => {
      next(error);
    });
  });

  router.post('/:userId/edit', routeGuard, (req, res, next) => {
    const userId = req.params.userId;
    User.findByIdAndUpdate(
         userId
      ,
      {
        name: req.body.name,
        email: req.body.email,
        location: req.body.location,
        theme: req.body.theme
      }
    )
      .then(data => {
        res.redirect(`/${userId}`);
      })
      .catch(error => {
        next(error);
      });
  });

// picture

router.get('/:userId/edit/pic', routeGuard, (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
  .then(user => {
    res.render('profile-edit-pic', { user });
  })
  .catch(error => {
    next(error);
  });
});

router.post('/:userId/edit/pic', routeGuard, uploader.single('profile'), (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndUpdate(
       userId
    ,
    {
      imgPath: req.file.originalname,
      imgName: req.file.url
    }
  )
    .then(data => {
      res.redirect(`/${userId}`);
    })
    .catch(error => {
      next(error);
    });
});
    

module.exports = router;
