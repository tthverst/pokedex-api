var mongoose = require('mongoose');

/* // Localhost
module.exports = function () {
	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost:27017/pokeapi');
	return mongoose;
}; */

 // mLab production
module.exports = function () {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://ash:catchpokemons@ds111319.mlab.com:11319/pokeapi');
    return mongoose;
};
/*
//mLab development
module.exports = function () {
      mongoose.Promise = global.Promise;
      mongoose.connect('mongodb://ash:catchpokemon@ds151060.mlab.com:51060/pokeapi-test');
      return mongoose;
 };