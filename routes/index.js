var express = require('express');
var router = express();

module.exports = function(passport){
	/* GET home page. */
	router.route('/')
		.get(function(req, res, next) {
			if(req.isAuthenticated()){
				res.redirect('/profile');
			} else{
				res.render('index', { title: 'Passport and ACL demo' });
			}
		});

	router.route('/logout')
		.get(function(req, res){
			req.logout();
			res.redirect('/');
		});

    router.route('/profile')
    	.get(function(req, res) {
		        res.render('account/profile', {
		        	title: 'Your profile', 
		            user : req.user // get the user out of session and pass to template
		        });
		    }
		);

	// =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    router.route('/auth/google')
    	.get(passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.route('/auth/google/callback')
    	.get(passport.authenticate('google', { successRedirect : '/profile', failureRedirect : '/' }));


	router.route('/connect/google')
		.get(passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    router.route('/connect/google/callback')
		.get(passport.authorize('google', { successRedirect : '/profile', failureRedirect : '/' }));

	router.route('/unlink/google')
		.get(function(req, res) {
			var user = req.user;
			user.google.token = undefined;
			user.save(function(err) {
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
    	.get(passport.authenticate('github', { }));

    // the callback after github has authenticated the user
    router.route('/auth/github/callback')
    	.get(passport.authenticate('github', { successRedirect : '/profile', failureRedirect : '/' }));

	router.route('/connect/github')
		.get(passport.authorize('github', { scope : ['user:email'] }));

    // the callback after github has authorized the user
    router.route('/connect/github/callback')
		.get(passport.authorize('github', { successRedirect : '/profile', failureRedirect : '/' }));

	router.route('/unlink/github')
		.get(function(req, res) {
        	var user = req.user;
        	user.github.token = undefined;
			user.save(function(err) {
				res.redirect('/profile');
			});
		});


	return router;	
};
