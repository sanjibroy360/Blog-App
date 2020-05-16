var passport = require('passport');
var githubStarategy = require("passport-github").Strategy;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;
var twitterStrategy = require('passport-twitter');

var User = require('../models/user');


passport.use(
    new githubStarategy(

        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
        },

        (accessToken, refreshToken, profile, done) => {
            // check whether existing or not

            User.findOne({username : profile._json.login}, (err, user) => {
                if(err) return console.log("First step error: ", err);

                obj = {
                    username: profile._json.login,
                    name: profile._json.name,
                    email: profile._json.email || null,
                    password: "password"
                };      

                if(!user) {
                    User.create(obj, (err, userCreated) => {
                        if(err) return console.log(err);
                        
                        console.log("User:",userCreated);
                        done(null, userCreated);
                    })

                } else {
                    done(null, user); 
                }
            })

            
            // done(null, profile); //success
        },

    )
);

passport.serializeUser((user, done) => {

    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log("UserId: ",id);
    done(null, id);
})

// Google

passport.use(
    new googleStrategy(

        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            
            callbackURL: "http://localhost:3000/auth/google/callback",
        },

        (accessToken, refreshToken, profile, done) => {
            // check whether existing or not

            console.log("Profile: ", profile);

            User.findOne({email: profile.emails[0].value}, (err, user) => {
                if(err) return console.log("First step error: ", err);

                obj = {
                    username: profile.displayName,
                    name: profile.displayName,
                    email: profile.emails[0].value || null,
                    password: "password"
                };      

                if(!user) {
                    User.create(obj, (err, userCreated) => {
                        if(err) return console.log(err);
                        
                        console.log("User:",userCreated);
                        done(null, userCreated);
                    })

                } else {
                    done(null, user); 
                }
            })

            
            // done(null, profile); //success
        },

    )
);

passport.serializeUser((user, done) => {

    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log("UserId: ",id);
    done(null, id);
})

// Twitter

passport.use(
    new twitterStrategy(

        {
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            
            callbackURL: "http://localhost:3000/auth/twitter/callback",
        },

        (token, tokenSecret, profile, done) => {
            // check whether existing or not

            console.log("Profile: ", profile);

            User.findOne({username: profile._json.screen_name}, (err, user) => {
                if(err) return console.log("First step error: ", err);

                obj = {
                    username: profile._json.screen_name,
                    name: profile._json.name,
                    email: null,
                    password: "password"
                };      

                if(!user) {
                    User.create(obj, (err, userCreated) => {
                        if(err) return console.log(err);
                        
                        console.log("User:",userCreated);
                        done(null, userCreated);
                    })

                } else {
                    done(null, user); 
                }
            })

            
            // done(null, profile); //success
        },

    )
);

passport.serializeUser((user, done) => {

    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log("UserId: ",id);
    done(null, id);
})


