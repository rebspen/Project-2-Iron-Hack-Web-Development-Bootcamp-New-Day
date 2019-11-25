'use strict';

const { Router } = require('express');
const router = new Router();
const Post = require('./../models/post');
const routeGuard = require('./../middleware/route-guard');
const Quote = require('inspirational-quotes');

router.get('/create', routeGuard, (req, res, next) => {
  res.render('post/create');
});

// router.get('/quote', routeGuard, (req, res, next) => {
//   res.render('post/quote');
// });

router.get('/quote', routeGuard, (req, res, next) => {
  const quote = Quote.getQuote();
  console.log("LOOOOOOK" , quote, req.session.user);
  res.render('post/quote', {quote});
});

router.post('/create', routeGuard, (req, res, next) => {
  // console.log(req.file);
  console.log("HEEEEEERRRRRREEEEE ", req.session.user , req.body.grateful , req.body.affirmation);
  Post.create({
    gratitude : req.body.grateful,
    great: req.body.great,
    affirmation: req.body.affirmation,
    author : req.session.user,
    today :"",
    better: ""
  })
  .then(
    res.redirect(`/post/quote`)
    )
    .catch(error => {
      next(error);
    });
  });

module.exports = router;
