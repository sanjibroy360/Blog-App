// Require
const express = require('express');
const mongoose = require('mongoose');

// require routers

const userRouter = require('./routers/users')

// Connect to database

mongoose.connect("mongodb//localhost:27017/medium-crud", {
useUnifiedTopology : true, useNewUrlParser : true
}, (err) => {
    
    console.log("Connected: ", err ? err : true);
});


// instansiate

const app = express();

// middlewares



// routing middlewares

app.use('/users', userRouter);

// Setup view

app.set('view engine', ejs);
app.set('views',__dirname + '/views');

// 404

app.use((err, req, res, next) => {
    res.send(`Error: ${err.msg || err.Message}`);
})

// server or client side error


// listener



