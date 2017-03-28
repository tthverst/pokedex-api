var async = require('async');

function saveCallback(err) {
	if (err) {
		console.log('Fill testdata failed, reason: %s', err)
	}
};


function fillTestPokemon(Pokemon, done) {
	var testData = [
		{ id: '1', name: 'Bulbasaur', height: 7, weight: 69, types: ["grass", "poison"], stats: { "hp": 45, "attack": 49, "defence": 49, "sp-atk": 65, "sp-def": 65, "speed": 45 }, capture_rate: 45, flavour_text: "Dolom etcet" },
		{ id: '4', name: 'Charmander', height: 6, weight: 85, types: ["fire"], stats: { "hp": 39, "attack": 52, "defence": 43, "sp-atk": 60, "sp-def": 50, "speed": 65 }, capture_rate: 45, flavour_text: "Lorem ipsum" },
		{ id: '7', name: 'Squirtle', height: 5, weight: 90, types: ["water"], stats: { "hp": 44, "attack": 48, "defence": 65, "sp-atk": 50, "sp-def": 64, "speed": 43 }, capture_rate: 45, flavour_text: "Hello me" },
		{ id: '10', name: 'Caterpie', height: 3, weight: 29, types: ["bug"], stats: { "hp": 45, "attack": 30, "defence": 35, "sp-atk": 20, "sp-def": 20, "speed": 45 }, capture_rate: 255, flavour_text: "I am popular" },
		{ id: '13', name: 'Weedle', height: 3, weight: 32, types: ["bug", "poison"], stats: { "hp": 40, "attack": 35, "defence": 30, "sp-atk": 20, "sp-def": 20, "speed": 50 }, capture_rate: 255, flavour_text: "I am popular too!" },
	];

	Pokemon.find({}, function (err, data) {
		// Als er nog geen boeken zijn vullen we de testdata
		if (data.length == 0) {
			console.log('Creating pokemon testdata');

			testData.forEach(function (pokemon) {
				new Pokemon(pokemon).save(saveCallback);
			});
		} else {
			console.log('Skipping create pokemon testdata, allready present');
		}
	});

	done();
};

module.exports = function (model) {
	async.waterfall([
		function (done) { fillTestPokemon(model.Pokemon, done); }
	]);
}