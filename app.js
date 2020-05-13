var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var auth = require("./middleware/auth")


var session = require('express-session');
var Mongostore = require('connect-mongo')(session);

var Article = require('./models/article');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/articles');

var app = express();

// Database Connect

mongoose.connect("mongodb://localhost:27017/blog",
{useUnifiedTopology : true, useNewUrlParser : true},(err) => {
  console.log("Connected: ", err ? err : true);
});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"keyboad cat",
    resave: true,
    saveUninitialized: false,
    store: new Mongostore({mongooseConnection: mongoose.connection})
  })
);



// app.use('/articles',(req, res, next) => {

//   if(req.session && req.session.userId) {
    
//     let userId = req.session.userId;
//     next();

//   } else {
      
//       console.log(req.headers);
//       req.session.destroy();
//       res.clearCookie('connect.sid');
//       res.redirect("/users/login");
      
//   }
  
// })

// app.use('/articles', auth.userAccess);


// app.use((req, res, next) => {
//   console.log(req.headers);
//   console.log(req.session);
//   var num = req.cookies.count;
  
//   if(req.cookies.count) {
    
//     res.cookie("count", +num + 1);

//   } else {

//     res.cookie("count", 1);

//   }

//   next();
// })

app.use(auth.getUserInfo);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles',articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// router

// app.get('/', (req, res, next) => {
//   console.log("hello");
//   Article.find({}, (err, articles) => {
//       if(err) return next(err);
//       res.render("index", {articles});
//   })
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
