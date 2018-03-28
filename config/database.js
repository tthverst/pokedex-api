var mongoose = require('mongoose');

// mLab production
module.exports = function () {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://ash:catchpokemons@ds111319.mlab.com:11319/pokeapi');
    return mongoose;
};
