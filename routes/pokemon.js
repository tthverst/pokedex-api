var express = require('express');
var router = express();
var Pokemon;
var _ = require('underscore');
var handleError;
var async = require('async');
var acl;

function getPokemons(req, res) {
    Pokemon.find({}, function (err, pokemons) {
        if (err) { return handleError(err); }
        res.json(pokemons);
    });
}

function getPokemon(req, res) {
    Pokemon.findById(req.params.name, function(err, pokemon) {
        if (err) { return handleError(err); }
        res.json(pokemon);
    })
}

router.use(function (req, res, next) {
    console.log("Pokemons are here!");
    next();
})

router.route('/')
    .get(getPokemons)
// router.route('/')
//     .get(function (req, res) {
//         res.render('pokemons', {
//             title: 'Pokemons'
//         });
//     }
//     );

router.route('/:name').get(getPokemon);

module.exports = function (model, errCallback) {
    console.log('Initializing pokemons routing module');
    Pokemon = model.Pokemon;
    handleError = errCallback;
    return router;
}