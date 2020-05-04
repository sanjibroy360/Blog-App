const express = require('express');
const router = express.Router();

const User = require('../models/user');


const articleRouter = require('./articles');



// Show User

router.get('/all', (req, res, next) => {
    User.find({}, (err, userList) => {
        if (err) {
            return next(err);
        } else {
            res.render("allUser", { user: userList })
        }
    })
})

router.use('/', articleRouter);



// Create User

router.get('/new', (req, res) => {
    res.render("createUser");
});

router.post('/new', (req, res, next) => {

    User.create(req.body, (err, data) => {
        if (err) {
            return next(err);
        } else {
            console.log(data.username);
            res.render("successMsg", { msg: `User created successfully!` })
        }
    })
});


// User Profile

router.get('/:username/profile', (req, res, next) => {

    res.render("profile", { user: req.params.username });

})

// edit 

router.get('/:username/edit', (req, res, next) => {

    User.findOne({ username: req.params.username }, (err, userInfo) => {
        if (err) {
            return next(err);
        } else {
            res.render("editUser", { user: userInfo });
        }
    })
})


router.post('/:username/edit', (req, res, next) => {
    User.findOneAndUpdate({ username: req.params.username }, req.body, (err, userInfo) => {
        if (err) {
            return next(err);
        } else {
            res.render("successMsg", { msg: "User Updated Successfully!" });
        }
    })
})

//delete

router.get('/:username/delete', (req, res, next) => {
    User.findOneAndDelete({ username: req.params.username }, req.body, (err, userInfo) => {
        if (err) {
            return next(err);
        } else {
            res.render("index");
        }
    })
})

// articles





module.exports = router;
