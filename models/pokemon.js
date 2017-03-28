var _ = require('underscore');

var init = function (mongoose) {
    var pokemonSchema = mongoose.Schema({
        id: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true, lowercase: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true },
        types: { type: [String], required: true, lowercase: true },
        stats: {
            "hp": { type: Number, required: true },
            "attack": { type: Number, required: true },
            "defence": { type: Number, required: true },
            "sp-atk": { type: Number, required: true },
            "sp-def": { type: Number, required: true },
            "speed": { type: Number, required: true }
        },
        capture_rate: { type: Number, required: true },
        flavour_text: { type: String }
    });

    return mongoose.model('Pokemon', pokemonSchema);
};

module.exports = init;