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
    var query = {};
    var limit = 10;
    var page = 1;

    if (req.params.name) { query.name = req.params.name; };
    if (req.query.type) { query.types = req.query.type; };
    if (req.query.capture_rate) { query.capture_rate = req.query.capture_rate; };
    if (req.query.heigth) { query.heigth = parseInt(req.query.heigth); };
    if (req.query.weigth) { query.weigth = req.query.weight; };

    var result = Pokemon.find(query);

    if (req.query.limit) { limit = parseInt(req.query.limit); }
    result.limit(limit);

    if (req.query.page) { page = parseInt(req.query.page); }
    result.skip((page - 1) * limit);

    result.sort({ id: 1 });

    result.exec(function (err, pokemons) {
        if (err) { return handleError(err, res, 400, "Pokemons not found."); }

        if ($.isEmptyObject(pokemons) && query.name) {
            getPokemonFromPokeApi(req, res);
        } else {
            res.format({
                'text/html': function () {
                    res.status(200).render('pokemons.handlebars', {
                        pokemons: pokemons,
                        prevPage: page - 1 > 0 ? page - 1 : null,
                        nextPage: pokemons.length >= limit ? page + 1 : null,
                        limit: limit,
                        showButtons: pokemons.length > 1 ? true : false
                    });
                },

                '*/*': function () {
                    res.status(200).send({ pokemons: pokemons });
                }
            });
        };
    });
}

function getPokemonFromPokeApi(req, res) {
    var r = request("http://pokeapi.co/api/v2/pokemon/" + req.params.name.toLowerCase())

    r.on('response', function (response) {

        if (response.statusCode === 200) {
            r.pipe(request.post("http://" + req.hostname + ":8080/pokemons"));

            r.on('end', function () {
                r = request("http://pokeapi.co/api/v2/pokemon-species/" + req.params.name.toLowerCase())

                r.on('response', function (response) {
                    r.pipe(request.patch("http://" + req.hostname + ":8080/pokemons/" + req.params.name.toLowerCase(), function () {
                        res.redirect("http://" + req.hostname + ":8080/pokemons/" + req.params.name.toLowerCase());
                    }));
                });
            });
        } else {
            res.send("Pokemon not found.");
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

function patchPokemon(req, res) {
    Pokemon.findOne({ "name": req.params.name.toLowerCase() }, function (err, pokemon) {
        if (err) { return handleError(err); }

        pokemon.capture_rate = req.body.capture_rate;

        $.each(req.body.flavor_text_entries, function (index, entry) {
            if (entry.version.name === "red") {
                pokemon.flavour_text = entry.flavor_text
            };
        });

        pokemon.save(function (err) {
            if (err) { return handleError(err, res, 400, "Pokemon is not updated."); }
            res.status(201).send("Pokemon updated");
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

    router.route('/:name')
        .get(getPokemons)
        .patch(patchPokemon)
        .delete(role.can("delete pokemons"), deletePokemon);

    return router;
}