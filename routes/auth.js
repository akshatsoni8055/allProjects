/* GET users listing. */
var express = require('express');
var app = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt')
const generatePassword = require('password-generator')
const { User } = require('../db/models')
const { sendPassword } = require('./helper/mailer')
const googleStrategy = require('passport-google-oauth20').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const localStrategy = require('passport-local').Strategy;


function isLoggedIn(req, res, next) {
    if (req.user) return next();

    req.session.msg = 'Get logged in first'
    res.redirect('/auth/login');
}

async function auth(token, refreshToken, profile, done) {
    // find the user in the database based on their facebook id
    try {
        const user = await User.findOne({ 'email': profile.emails[0].value });

        const password = generatePassword(6)
        const hashedPassword = await bcrypt.hash(password, 10)


        if (user) {
            return done(null, user); // user found, return that user
        } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User({
                email: profile.emails[0].value,
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                token: token,
                pic: profile.photos[0].value,
                password: hashedPassword
            });

            sendPassword(profile.emails[0].value, password)

            // save our user to the database
            await newUser.save();

            return done(null, newUser);
        }
    } catch (err) {
        return done(err);
    }
}
passport.use(new localStrategy(
    async function (username, password, cb) {

        const user = await User.findOne({ email: username }).select({ threads: 0 })

        if (user) {
            const isTrue = await bcrypt.compare(password, user.password)
            if (isTrue) {
                return cb(null, user)
            } else {
                return cb(null, false)
            }
        } else {
            return cb(null, false)
        }
    }
));

passport.use(new googleStrategy({

    clientID: process.env.GclientID,
    clientSecret: process.env.GclientSecret,
    callbackURL: process.env.gredirect,
    accessType: 'offline',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'

}, auth));

passport.use(new facebookStrategy({

    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.fbredirect,
    profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)']

}, auth));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// logging in a user
app.get('/login', (req, res) => {
    if (req.user) return res.redirect('/inbox')
    let msg = req.session.msg
    delete req.session.msg
    return res.render('login', { title: 'Login', user: req.user, msg: msg });
})

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/inbox',
        failureRedirect: '/auth/login'
    }),
    function (req, res) {
        res.redirect('/auth');
    });

// registering a new user
app.post("/register", async function (req, res) {
    let result = await User.findOne({ email: req.body.email })
    if (!result) {
        const password = await bcrypt.hash(req.body.password, 10)
        try {
            const newUser = new User({
                email: req.body.email,
                fname: req.body.fname,
                lname: req.body.lname,
                password: password,
                pic: '/images/avtar.jpg'
            })

            await newUser.save()
            req.session.msg = `Registered Successfully`
            res.redirect('/auth/login')

        } catch (error) {
            console.log(error)
        }

    } else {
        req.session.msg = `This Email already has been registered`
        res.redirect('/auth/login')
    }
});

app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/inbox',
        failureRedirect: '/auth/login'
    }));

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/inbox',
        failureRedirect: '/auth/login'
    }));

app.get('/logout', function (req, res) {
    req.logout((err) => {
        req.session.destroy();
        res.redirect('/');
    });
});

module.exports = { app, isLoggedIn }
