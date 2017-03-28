var ConnectRoles = require('connect-roles');

module.exports = function () {
	var roles = new ConnectRoles({
		failureHandler: function (req, res, action) {
			res.render('access-denied', { action: action });
		}
	});

	// Access authors can only be done by author
	roles.use('access authors', function (req) {
		if (req.user.hasAnyRole('author')) {
			return true;
		};
		// Don't return false, this way we can get into the next checker.
	});

	// Admins can do everything
	roles.use(function (req) {
		if (req.user.hasAnyRole('admin')) {
			return true;
		};
	});

	roles.use('view authors books', function (req) {
		// /authors/:id/books/
		// /authors/:id/books/:bookId
		if (req.user.local.username == req.params.id) {
			return true;
		};
		// Don't return false, this way we can get into the next checker.
	});

	roles.use('edit authors books', function (req) {
		// /authors/:id/books/
		// /authors/:id/books/:bookId
		if (req.user.hasAllRoles(['author', 'owner']) && req.user.local.username == req.params.id) {
			return true;
		};
		// Don't return false, this way we can get into the next checker.
	});

	return roles;
};