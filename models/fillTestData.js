var async = require('async');

function saveCallback(err) {
	if (err) {
		console.log('Fill testdata failed, reason: %s', err)
	}
};


function fillTestPokemon(Pokemon, done) {
	var testData = [
		{ id: 1, name: 'Bulbasaur', height: 7, weight: 69, types: ["grass", "poison"], stats: { "hp": 45, "attack": 49, "defense": 49, "special-attack": 65, "special-defense": 65, "speed": 45 }, capture_rate: 45, flavour_text: "Dolom etcet" },
		{ id: 4, name: 'Charmander', height: 6, weight: 85, types: ["fire"], stats: { "hp": 39, "attack": 52, "defense": 43, "special-attack": 60, "special-defense": 50, "speed": 65 }, capture_rate: 45, flavour_text: "Lorem ipsum" },
		{ id: 7, name: 'Squirtle', height: 5, weight: 90, types: ["water"], stats: { "hp": 44, "attack": 48, "defense": 65, "special-attack": 50, "special-defense": 64, "speed": 43 }, capture_rate: 45, flavour_text: "Hello me" },
		{ id: 10, name: 'Caterpie', height: 3, weight: 29, types: ["bug"], stats: { "hp": 45, "attack": 30, "defense": 35, "special-attack": 20, "special-defense": 20, "speed": 45 }, capture_rate: 255, flavour_text: "I am popular" },
		{ id: 13, name: 'Weedle', height: 3, weight: 32, types: ["bug", "poison"], stats: { "hp": 40, "attack": 35, "defense": 30, "special-attack": 20, "special-defense": 20, "speed": 50 }, capture_rate: 255, flavour_text: "I am popular too!" },
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

function fillTestUser(User, done) {
	var adminUser = new User();
	adminUser.role = "admin";
	adminUser.local = { "username": "admin", "password": adminUser.generateHash("admin") }

	User.findOne({ "local.username": "admin" }, function (err, data) {
		if (!data) {
			console.log('Creating admin user');

			adminUser.save(saveCallback);
		} else {
			console.log('Skipping creating admin user, allready present');
		}
	})
}

module.exports = function (model) {
	async.waterfall([
		function (done) { fillTestPokemon(model.Pokemon, done); },
		function (done) { fillTestUser(model.User, done); }
	]);
}