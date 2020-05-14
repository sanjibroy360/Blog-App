var passport = require('passport');
var githubStarategy = require("passport-github").Strategy;


passport.use(
    new githubStarategy(

        {
            clientID:process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        
        (accessToken, refreshToken, profile, done) => {
            // check whether existing or not



            console.log(profile); // failed 
            done(null, profile); //success
        },
        
    )
);

// passport.serializeUser((user, done) => {

//     done(null, user.id);

// });

// passport.deserializeUser((user, done) => {
//     var user = {}
// })