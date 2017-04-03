var init = function (mongoose) {
    var locationSchema = mongoose.Schema({
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
		pokemon: { type: Number, required: true, ref: 'Pokemon' }
    });

    return mongoose.model('Location', locationSchema);
};

module.exports = init;