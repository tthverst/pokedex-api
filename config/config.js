module.exports = function(env) {
	
	switch(env) {
		case 'dev':
			process.env.BASEURL = 'localhost';
			process.env.PORT = 8080;
			process.env.FULLURL = process.env.BASEURL + ":" + process.env.PORT;
			break;
		case 'prod':
			process.env.BASEURL = 'avanspokemons.herokuapp.com';
			process.env.FULLURL = process.env.BASEURL;
			break;
		default:
			process.env.BASEURL = 'localhost';
			process.env.PORT = 8080;
			process.env.FULLURL = process.env.BASEURL + ":" + process.env.PORT;
			break;
	}

}