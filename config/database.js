var mongoose = require('mongoose');

// Localhost
// module.exports = function () {
//     mongoose.Promise = global.Promise;
//     mongoose.connect('mongodb://localhost:27017/pokeapi');
//     return mongoose;
// };

// mLab
module.exports = function () {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://ash:catchpokemons@ds115110.mlab.com:15110/pokeapi');
    return mongoose;
};