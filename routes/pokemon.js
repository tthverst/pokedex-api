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
var $ = require('jquery')(window);

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
    }).sort( { id: 1 } );
}

function getPokemon(req, res) {
    Pokemon.find({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err, res, 404, "Pokemon not found."); }

        if ($.isEmptyObject(pokemon)) {
            request.get("http://pokeapi.co/api/v2/pokemon/" + req.params.name.toLowerCase())
                .on('error', function (err) {
                    return handleError(err, res, 404, "Pokemon not found.");
                })
                .pipe(request.post("http://" + req.hostname + ":8080/pokemons", function () {
                    res.redirect("http://" + req.hostname + ":8080/pokemons");
                }));
        } else {
            res.status(200).json(pokemon);
        }
    });
}

function postPokemon(req, res) {
    var pokemon = new Pokemon();

    pokemon.id = req.body.id;
    pokemon.name = req.body.name;
    pokemon.height = req.body.height;
    pokemon.weight = req.body.weight;
    pokemon.types = [];
    pokemon.stats = {};
    // pokemon.capture_rate = req.body.capture_rate;
    // pokemon.flavour_text = req.body.flavour_text;

    $.each(req.body.types, function (index, type) {
        pokemon.types.push(type.type.name);
    });

    $.each(req.body.stats, function (index, stat) {
        pokemon.stats[stat.stat.name] = stat.base_stat;
    });

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
        .post(postPokemon);
    // .post(role.can("manage pokemons"), postPokemon);

    router.route('/:name')
        .get(getPokemon)
        .delete(role.can("manage pokemons"), deletePokemon);
        
    return router;
}