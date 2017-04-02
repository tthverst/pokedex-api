var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GitHubStatery = require('passport-github2');

// load the auth variables
var configAuth = require('../config/auth');

var init = function (User) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    var localOptions = {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }

    passport.use('local-signup', new LocalStrategy(localOptions, function (req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function () {

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.username': username.toLowerCase() }, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {

                    // if there is no user with that username
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.username = username.toLowerCase();
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy(localOptions, function (req, username, password, done) { // callback with username and password from our form

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username': username.toLowerCase() }, function (err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user || !user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! username/password incorrect.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    var googleOptions = {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
    };

    passport.use(new GoogleStrategy(googleOptions, function (req, token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {
            if (!req.user) {
                // try to find the user based on their google id
                User.findOne({ 'google.id': profile.id }, function (err, user) {
                    console.log(user);
                    if (err)
                        return done(err);

                    if (user) {
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name = profile.displayName;
                            user.google.email = profile.emails[0].value;

                            user.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        // if a user is found, log them in
                        return done(null, user);
                    }

                    return done(null, false, req.flash('loginMessage', 'Please sign-up with a local account first.'));
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = profile.emails[0].value;

                // save the user
                user.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));

    // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================

    var githubOptions = {
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL,
        passReqToCallback: true
    };

    passport.use(new GitHubStatery(githubOptions, function (req, token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function () {
            if (!req.user) {
                // try to find the user based on their google id
                User.findOne({ 'github.id': profile.id }, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        // just add our token and profile information
                        if (!user.github.token) {
                            user.github.token = token;
                            user.github.name = profile.displayName;
                            user.github.username = profile.username;

                            user.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        // if a user is found, log them in
                        return done(null, user);
                    }

                    return done(null, false, req.flash('loginMessage', 'Please sign-up with a local account first.'));
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.github.id = profile.id;
                user.github.token = token;
                user.github.name = profile.displayName;
                user.github.username = profile.username;

                // save the user
                user.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }
    ));

    return passport;
};

module.exports = init;