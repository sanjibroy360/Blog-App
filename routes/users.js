var express = require('express');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render("register");
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    if(err) return next(err);
    console.log(res.body);
    res.redirect("/users/login");
  })
})


// Login

router.get('/login', (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {


  const { email , password } = req.body;

  User.findOne({email}, (err, user) => {

    if(err) return next(err);
    else if(!user) return res.render("success", {msg : "Wrong email"});

    user.varifyPassword(password, function callBack(err, check) {

      if(err) return next(err);
      
      if(!check) {
        res.render("success", {msg : "Wrong email or password"})
      } else {
          res.redirect("/articles");
      }

    });
  })
  
})

module.exports = router;
