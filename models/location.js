var init = function (mongoose) {
    var locationSchema = mongoose.Schema({
        lat: { type: Number, required: true },
		lng: { type: Number, required: true },
		pokemon_id: { type: Number, required: true }
    });

    return mongoose.model('Location', locationSchema);
};

module.exports = init;