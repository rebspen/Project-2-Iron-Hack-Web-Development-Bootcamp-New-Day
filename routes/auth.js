'use strict';

const { Router } = require('express');
const router = new Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-in');
});


module.exports = router;
