var express = require('express');
var path = require('path');
const Article = require('../models/article');
var router = express.Router();
var multer = require('multer');
const User = require('../models/user');

// var upload = multer({dest: '../public/images/'});

var storage = multer.diskStorage({
  
  destination: function(req, file, cb) {
    cb(null,path.normalize(path.join(__dirname,"../public/images/uploads")));
  },

  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({storage: storage});

// -----------------------






/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render("register");
});

router.post('/register', upload.single('avatar'), (req, res, next) => {
  
  console.log("File: ",req.file);
  console.log("Body: ", req.body);
  req.body.avatar = req.file.filename; 
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
