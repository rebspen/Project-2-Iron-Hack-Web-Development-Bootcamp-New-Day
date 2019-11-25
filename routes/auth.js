'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-in', (req, res, next) => {
  res.render('auth/sign-in');
});

router.get('/sign-up', (req, res, next) => {
  res.render('auth/sign-up');
});


module.exports = router;
