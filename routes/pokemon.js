var express = require('express');
var router = express();
var path = require('path');
var _ = require('underscore');
var handleError;
var async = require('async');
var request = require('request');

var jsdom = require('jsdom').jsdom;
var doc = jsdom();
var window = doc.defaultView;

function getPokemons(req, res) {
    var query = {};
    var limit = 10;
    var page = 1;

    if (req.params.name) { query.name = req.params.name; };
    if (req.query.type) { query.types = req.query.type; };
    if (req.query.capture_rate) { query.capture_rate = req.query.capture_rate; };
    if (req.query.heigth) { query.heigth = parseInt(req.query.heigth); };
    if (req.query.weigth) { query.weigth = parseInt(req.query.weight); };

    var result = Pokemon.find(query);

    if (req.query.filter) {
        query = {};

        if (!Array.isArray(req.query.filter)) {
            req.query.filter = [req.query.filter]
        }

        req.query.filter.forEach(function (element) {
            query[element] = 1;
        })

        var result = Pokemon.find(null, query);
    };

    if (req.query.limit) { limit = parseInt(req.query.limit); }
    result.limit(limit);

    if (req.query.page) { page = parseInt(req.query.page); }
    result.skip((page - 1) * limit);

    result.sort({ id: 1 });

    result.exec(function (err, pokemons) {
        if (err) { return handleError(err, res, 400, "Pokemons not found."); }

        if (pokemons.length <= 0 && req.params.name) {
            getPokemonFromPokeApi(req, res);
        } else {
		
			res.status(200).json(pokemons);
			
        };
    });
}

function getPokemonFromPokeApi(req, res) {
    request("http://pokeapi.co/api/v2/pokemon/" + req.params.name.toLowerCase(), function (error, response, body) {
        if (response.statusCode !== 200) {
            res.status(404).send("Pokemon not found");
        } else {
            addPokemon(req, res, JSON.parse(body));
        }
    });
}

function addPokemon(req, res, pokemonData) {
    var pokemon = new Pokemon();

    pokemon._id = pokemonData.id;
    pokemon.id = pokemonData.id;
    pokemon.name = pokemonData.name;
    pokemon.height = pokemonData.height;
    pokemon.weight = pokemonData.weight;
    pokemon.types = [];
    pokemon.stats = {};

    pokemonData.types.forEach(function (type) {
        pokemon.types.push(type.type.name);
    });

    pokemonData.stats.forEach(function (stat) {
        pokemon.stats[stat.stat.name] = stat.base_stat;
    });

    pokemon.save(function (err) {
        if (err) { return handleError(err, res, 400, "Pokemon is not added. You might have chosen an ID or name that already exists."); }

        request("http://pokeapi.co/api/v2/pokemon-species/" + req.params.name.toLowerCase(), function (error, response, body) {
            updatePokemon(req, res, JSON.parse(body));
        });
    });
}

function updatePokemon(req, res, pokemonData) {
    Pokemon.findOne({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err); }

        pokemon.capture_rate = pokemonData.capture_rate;

        pokemonData.flavor_text_entries.forEach(function (entry) {
            if (entry.version.name === "red") {
                pokemon.flavour_text = entry.flavor_text
            };
        });

        pokemon.save(function (err) {
            if (err) { return handleError(err, res, 400, "Pokemon is not updated."); }
            res.status(201).redirect('/pokemons/' + req.params.name.toLowerCase());
        });
    });
}

function deletePokemon(req, res) {
    Pokemon.remove({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err, res, 400, "Pokemon is not removed."); }
        res.status(200).send("Pokemon removed");
    });
}

module.exports = function (model, role, errCallback) {
    Pokemon = model.Pokemon;
    handleError = errCallback;

    // Routing
    router.route('/')
        .get(getPokemons)

    router.route('/:name')
        .get(getPokemons)
        .delete(role.can("delete pokemons"), deletePokemon);

    return router;
}