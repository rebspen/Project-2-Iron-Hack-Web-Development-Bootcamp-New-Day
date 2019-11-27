'use strict';

const { Router } = require('express');
const router = new Router();
const Post = require('./../models/post');
const routeGuard = require('./../middleware/route-guard');
const Quote = require('inspirational-quotes');
const unsplash = require('../middleware/unsplash.js');

router.get('/create', (req, res, next) => {
  res.render('post/create');
});

// router.get('/quote', routeGuard, (req, res, next) => {
//   res.render('post/quote');
// });

router.get('/quote', (req, res, next) => {
  const user = req.session.user;
  const quote = Quote.getQuote();
  unsplash.photos.getRandomPhoto({
    query : 'ocean',
    orientation: "portrait"
  })
  .then(data => {
    data.json().then(
      response=>{
        res.render('post/quote', {quote, user, response});
      }
    );
  });
});

router.post('/create', (req, res, next) => {
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
  
  router.get('/:postId/edit', (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
      res.render('post/pm', { post });
    })
    .catch(error => {
      next(error);
    });
  });
  
  router.post('/:postId/edit', (req, res, next) => {
    const postId = req.params.postId;
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
    
    router.post('/:authId/:postId/delete', (req, res, next) => {
      const postId = req.params.postId;
      const userId = req.params.authId;
      Post.findOneAndDelete({
        _id: postId
      })
      .then(data => {
        res.redirect(`/${userId}`);
      })
      .catch(error => {
        next(error);
      });
    });

module.exports = router;
