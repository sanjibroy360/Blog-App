var express = require('express');
const Article = require('../models/article');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render("register");
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createdUser) => {
    if(err) return next(err);
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
    req.session.userId = user.id;
   
  })
 
})


// Show My Content

router.get('/:id/myarticles', (req, res, next) => {

  let id = req.params.id;
  Article.find({author: id}, (err, articles) => {
    if(err) return next(err); 
    let currentUser = req.session.userId;
    res.render("showMyArticle", {articles, currentUser});  
  })

})


// Log out 

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login')
})

module.exports = router;
