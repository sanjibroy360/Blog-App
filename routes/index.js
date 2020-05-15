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

module.exports = router;
