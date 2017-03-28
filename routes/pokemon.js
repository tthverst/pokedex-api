var express = require('express');
var router = express();
var Pokemon;
var _ = require('underscore');
var handleError;
var async = require('async');
var acl;

function getPokemons(req, res) {
    var query = {};
    if (req.params.id) {
        query._id = req.params.id.toLowerCase();
    }

    Pokemon.find({}, function (err, data) {
        if (err) { return handleError(err); }

        if (req.params.id) {
            data = data[0];
        }
        console.log(res);
        res.json(data);
    });
}

router.route('/').get(getPokemons);

router.route('/')
    .get(function (req, res) {
        res.render('pokemons', {
            title: 'Pokemons',
            pokemons: getPokemons
        });
    }
    );

router.route('/:name').get(getPokemons);

module.exports = function (model, errCallback) {
    console.log('Initializing pokemons routing module');
    Pokemon = model.Pokemon;
    handleError = errCallback;
    return router;
}