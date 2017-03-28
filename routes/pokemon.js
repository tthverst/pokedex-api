var express = require('express');
var router = express();
var path = require('path');
var Pokemon;
var _ = require('underscore');
var handleError;
var async = require('async');
var acl;

function getPokemons(req, res) {
    Pokemon.find({}, function (err, pokemons) {
        if (err) { return handleError(err, res, 400, "Pokemons not found."); }		
		
        res.format({
			'text/html': function(){
				res.status(200).render('pokemons.handlebars', { pokemons: pokemons });
			},
			
			'*/*': function() {
				res.status(200).send({ pokemons: pokemons });
			}
		});
    });
}

function getPokemon(req, res) {
    Pokemon.find({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err, res, 404, "Pokemon not found."); }
        res.status(200).json(pokemon);
    });
}

function postPokemon(req, res) {
    var pokemon = new Pokemon();

    console.log(req.body);
    pokemon.id = req.body.pokemon_id;
    pokemon.name = req.body.name;
    pokemon.height = req.body.height;
    pokemon.weight = req.body.weight;
    pokemon.types = req.body.types;
    pokemon.stats = req.body.stats;
    pokemon.capture_rate = req.body.capture_rate;
    pokemon.flavour_text = req.body.flavour_text;

    pokemon.save(function (err) {
        if (err) { return handleError(err, res, 400, "Pokemon is not added. You might have chosen an ID or name that already exists."); }
        res.status(201).send("Pokemon created");
    });
}

function putPokemon(req, res) {
    Pokemon.findOne({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err); }

        pokemon.name = req.body.name;
        pokemon.height = req.body.height;
        pokemon.weight = req.body.weight;
        pokemon.types = req.body.types;
        pokemon.stats = req.body.stats;
        pokemon.capture_rate = req.body.capture_rate;
        pokemon.flavour_text = req.body.flavour_text;

        pokemon.save(function (err) {
            if (err) { return handleError(err, res, 400, "Pokemon is not updated. You might have chosen an name that already exists."); }
            res.status(200).json(pokemon);
        });
    });
}

function deletePokemon(req, res) {
    Pokemon.remove({ "name": req.params.name }, function (err, bear) {
        if (err) { return handleError(err, res, 400, "Pokemon is not removed."); }
        res.status(200).send("Pokemon removed");
    });
}

router.route('/')
    .get(getPokemons)
    .post(postPokemon);

router.route('/:name')
    .get(getPokemon)
    .put(putPokemon)
    .delete(deletePokemon);

module.exports = function (model, errCallback) {
    console.log('Initializing pokemons routing module');
    Pokemon = model.Pokemon;
    handleError = errCallback;
    return router;
}