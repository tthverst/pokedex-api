var _ = require('underscore');

var init = function (mongoose) {
    var locationSchema = mongoose.Schema({
        id: { type: Number, required: true, unique: true },
        lat: { type: Number, required: true, unique: true },
		lng: { type: Number, required: true, unique: true },
		pokemon_id: { type: Number, required: true }
    });

    return mongoose.model('Location', locationSchema);
};

module.exports = init;