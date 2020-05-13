const User = require('../models/user');

let checkLogin = (req, res, next) => {

    if(req.session && req.session.userId) {
        console.log("Login: True")
        next();
    } else {
        console.log("Middleware Trigged")
        res.redirect('/users/login');
    }
};


let getUserInfo = (req, res, next) => {

    if(req.session.userId && req.session) {
        
        let id = req.session.userId;

        User.findById(id, (err, userInfo) => {

            if(err) return next(err);

            req.currentUser = userInfo;
            res.locals.currentUser = userInfo;
            
            // console.log("session present");
            // console.log("locals: ",res.locals.userInfo);
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
