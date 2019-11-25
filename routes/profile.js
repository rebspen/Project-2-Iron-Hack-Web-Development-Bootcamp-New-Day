'use strict';

const { Router } = require('express');
const router = new Router();

const Post = require('./../models/post');
const User = require('./../models/user');

const routeGuard = require('./../middleware/route-guard');

router.get('/:userId', routeGuard, (req, res, next) => {
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
