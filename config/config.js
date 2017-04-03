module.exports = function () {
    switch(process.env.NODE_ENV){
		case 'dev':
			process.env.BASEURL = 'localhost'; 
			process.env.PORT = 8080;
		case 'prod':
			process.env.BASEURL = 'avanspokemons.herokuapp.com';
	}
}