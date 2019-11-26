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

module.exports = router;
