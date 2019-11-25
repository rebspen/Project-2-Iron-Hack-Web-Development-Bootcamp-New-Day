'use strict';

const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');
const User = require('./../models/user');

router.get('/profile/:userId', (req, res, next) => {
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
