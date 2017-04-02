var ConnectRoles = require('connect-roles');

module.exports = function () {
	var roles = new ConnectRoles({
		failureHandler: function (req, res, action) {
			if (action === 'access profile page') {
				res.redirect('/');
			} else {
				res.render('access-denied', { action: action });
			}
		}
	});

	// Admins can do everything
	roles.use(function (req) {
		if (req.user && req.user.hasAnyRole('admin')) {
			return true;
		};
	});

	roles.use('access profile page', function (req, res) {
		if (req.user) {
			return true;
		};
	});

	roles.use('delete pokemons', function (req) {
		if (req.user && req.user.hasAnyRole('admin')) {
			return true;
		};
	});

	roles.use('user management', function (req) {
		if (req.user && req.user.hasAnyRole('admin')) {
			return true;
		};
	});

	roles.use('this user', function (req) {
		if (req.user && req.user.local.username === req.params.username) {
			return true;
		};
	});

	return roles;
};