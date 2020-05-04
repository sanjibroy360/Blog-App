// Require
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// require routers

const userRouter = require('./routers/users');


// Connect to database

mongoose.connect("mongodb://localhost:27017/medium-crud",
{ useUnifiedTopology : true, useNewUrlParser : true}, (err) => {
    
    console.log("Connected: ", err ? err : true);
});


// instansiate

const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// routing middlewares

app.use('/users', userRouter);


// Setup app.use('/article')view

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');

// routers

app.get('/', (req, res) => {
    res.render("index");
})

// 404

app.use((err, req, res, next) => {
    console.log(err);
    res.render("errorMsg",{msg : `${err.msg || err.Message}`});
})

// server or client side error


// listener

app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`))



