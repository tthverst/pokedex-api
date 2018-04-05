var jwtDecode = require('jwt-decode');

module.exports = function(req, res, next) {
	
	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	
	if (token) {
		var decoded = jwtDecode(token);
		
		if (decoded.exp <= Date.now()) {
			res.end('Access token has expired', 400);
		}
		
		next();
	} 
	else {
		res.end('Forbidden', 403);
	}
};