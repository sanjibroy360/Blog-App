const User = require('../models/user');
const passport = require('passport');

let checkLogin = (req, res, next) => {

    if((req.session && req.session.userId) || (req.session.passport)) {
        console.log("Login: True")
        next();
    } else {
        console.log("Middleware Trigged")
        res.redirect('/users/login');
    }
};


let getUserInfo = (req, res, next) => {

    if((req.session.userId && req.session) || (req.session.passport)) {
        
        let id = req.session.userId || req.session.passport.user;

        User.findById(id, (err, userInfo) => {

            if(err) return next(err);

            req.currentUser = userInfo;
            res.locals.currentUser = userInfo;
            
            next();

        })
    }

    else {
        req.currentUser = null;
        res.locals.currentUser = null;
        next();
    }

};


module.exports = {
    checkLogin,
    getUserInfo
}
