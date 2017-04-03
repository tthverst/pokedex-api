module.exports = function(env) {
	
	switch(env) {
		case 'dev':
			process.env.BASEURL = 'localhost';
			process.env.PORT = 8080;
			break;
		case 'prod':
			process.env.BASEURL = 'avanspokemons.herokuapp.com';
			process.env.PORT = 8080;			
			break;
		default:
			process.env.BASEURL = 'localhost';
			process.env.PORT = 8080;
			break;
	}

}