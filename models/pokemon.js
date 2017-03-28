var _ = require('underscore');

var init = function (mongoose) {
    var pokemonSchema = mongoose.Schema({
        id      : Number,
        name    : String,
        weight  : Number,
        height  : Number,
        types   : [String],
        stats   : {
            "hp": Number,
            "attack": Number,
            "defence": Number,
            "sp-atk": Number,
            "sp-def": Number,
            "speed": Number
        },
        capture_rate: Number,
        flavour_text: String
    });

    return mongoose.model('Pokemon', pokemonSchema);
};

module.exports = init;