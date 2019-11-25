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

  router.get('/:postId', (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .populate('author')
      .then(post => {
        console.log(post);
        res.render('post/single-view', { post });
      })
      .catch(error => {
        next(error);
      });
  });

  router.get('/:postId/edit', routeGuard, (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then(post => {
          res.render('post/pm', { post });
      })
      .catch(error => {
        next(error);
      });
  });

router.post('/:postId/edit', routeGuard, (req, res, next) => {
  const postId = req.params.postId;
  console.log("POSTID -------------" , postId);
  Post.findOneAndUpdate(
    {
      _id: postId
    },
    {
      today: req.body.today,
      better: req.body.better
    }
    )
    .then(
      res.redirect(`/post/${postId}`)
      )
      .catch(error => {
        next(error);
      });
    });

module.exports = router;
