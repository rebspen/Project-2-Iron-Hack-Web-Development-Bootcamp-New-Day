'use strict';

const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');
const User = require('./../models/user');

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      res.render('profile', {user});
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
