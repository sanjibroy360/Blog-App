var express = require('express');
var router = express.Router();
var passport = require('passport');


require("dotenv").config();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.session)

  // res.render('index', { title: 'Express' });

  if(req.session && req.session.userId) {
    res.send("Session available")
  } else {
    res.render('index', { title: 'Express' });
  }
  
});

router.get('/failed', (req, res) => {
  res.send("Failed: ", req.session);
})

router.get("/auth/github", passport.authenticate("github"));
router.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: '/failed'}),
  (req, res) => {
    console.log("Success: ",req.session);
    res.redirect('/articles');
  }
);


// Google

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/articles');
  }
);

// Twitter

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/failed' }),

  function(req, res) {
   
    res.redirect('/articles');
  
  }
);

module.exports = router;
