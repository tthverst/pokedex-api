var express = require('express');
var router = express();

module.exports = function (passport, model, role) {
	/* GET home page. */
	router.route('/')
		.get(function (req, res, next) {
			if (req.isAuthenticated()) {
				res.redirect('/profile');
			} else {
				res.render('index', { title: 'PokeApi by Tom and Dennis' });
			}
		});

	router.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	router.route('/profile')
		.get(role.can("access profile page"),function (req, res) {
			res.format({
				'text/html': function(){
					res.status(200).render('profile.handlebars', { title: 'Your profile', user: req.user });
				},
				
				'*/*': function() {
					res.status(200).send({ user: req.user });
				}
			});
		});

	// =====================================
	// LOCAL LOGIN =========================
	// =====================================
	// show the login form
	router.route('/login')
		.get(function (req, res) {
			// render the page and pass in any flash data if it exists
			res.render('login', { message: req.flash('loginMessage') });
		});

	// process the login form
	router.route('/login')
		.post(passport.authenticate('local-login', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/login', // redirect back to the signup page if there is an error
			failureFlash: true // allow flash messages
		}));

	// =====================================
	// LOCAL SIGNUP ========================
	// =====================================
	// show the signup form
	router.route('/signup')
		.get(function (req, res) {
			// render the page and pass in any flash data if it exists
			res.render('signup', { signupMessage: req.flash('signupMessage'), loginMessage: req.flash('loginMessage') });
		});

	// process the signup form
	router.route('/signup')
		.post(passport.authenticate('local-signup', {
			successRedirect: '/profile', // redirect to the secure profile section
			failureRedirect: '/signup', // redirect back to the signup page if there is an error
			failureFlash: true // allow flash messages
		}));

	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	// send to google to do the authentication
	// profile gets us their basic information including their name
	// email gets their emails
	router.route('/auth/google')
		.get(passport.authenticate('google', { scope: ['profile', 'email'] }));

	// the callback after google has authenticated the user
	router.route('/auth/google/callback')
		.get(passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/signup', failureFlash: true }));


	router.route('/connect/google')
		.get(passport.authorize('google', { scope: ['profile', 'email'] }));

	// the callback after google has authorized the user
	router.route('/connect/google/callback')
		.get(passport.authorize('google', { successRedirect: '/profile', failureRedirect: '/' }));

	router.route('/unlink/google')
		.get(function (req, res) {
			var user = req.user;
			user.google.token = undefined;
			user.save(function (err) {
				res.redirect('/profile');
			});
		});

	// =====================================
	// GITHUB ROUTES =======================
	// =====================================
	// send to github to do the authentication
	// profile gets us their basic information including their name
	// email gets their emails
	router.route('/auth/github')
		.get(passport.authenticate('github', {}));

	// the callback after github has authenticated the user
	router.route('/auth/github/callback')
		.get(passport.authenticate('github', { successRedirect: '/profile', failureRedirect: '/signup', failureFlash: true }));

	router.route('/connect/github')
		.get(passport.authorize('github', { scope: ['user:email'] }));

	// the callback after github has authorized the user
	router.route('/connect/github/callback')
		.get(passport.authorize('github', { successRedirect: '/profile', failureRedirect: '/' }));

	router.route('/unlink/github')
		.get(function (req, res) {
			var user = req.user;
			user.github.token = undefined;
			user.save(function (err) {
				res.redirect('/profile');
			});
		});


	return router;
};
