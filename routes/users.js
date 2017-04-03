var express = require('express');
var router = express();
var path = require('path');
var _ = require('underscore');
var handleError;

function getUsers(req, res) {
    User.find({}, function (err, users) {
        if (err) { return handleError(err, res, 400, "Users not found."); }

        res.format({
            'text/html': function () {
                res.status(200).render('users.handlebars', { users: users });
            },

            '*/*': function () {
                res.status(200).send({ users: users });
            }
        });
    });
}

function getUser(req, res) {
    User.find({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 404, "User not found."); }
        
		res.format({
            'text/html': function () {
                res.redirect('/profile');
            },

            '*/*': function () {
                res.status(200).json(user);
            }
        });
		
    });
}

function patchUser(req, res) {
    User.findOne({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 404, "User not found."); }

        user.local.username = req.body.username;
        user.role = req.body.role;

        user.save(function (err) {
            if (err) { return err }
            res.status(200).redirect('/users');
        })
    });
}

function deleteUser(req, res) {
    User.remove({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 400, "User is not removed."); }
        res.status(200).redirect('/users');
    });
}

function catchPokemon(req, res) {
    User.findOne({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 404, "Pokemon not caught."); }

        user.pokemons.push(req.params.pokemonID);

        user.save(function (err) {
            if (err) { return err }
            res.status(200).send({ pokemons: user.pokemons });
        })
    });
}

function getCaughtPokemons(req, res){
	User
		.findOne({ "local.username": req.params.username })
		.populate('pokemons')
		.exec(function(err, data){
			if(err){ return handleError(req, res, 500, err); }

			res.json(data.pokemons);
		});
}

module.exports = function (model, role, errCallback) {
    User = model.User;
    handleError = errCallback;

    // Routing
    router.route('/')
        .get(role.can("user management"), getUsers)

    router.route('/:username')
        .get(role.can("this user"), getUser)
        .patch(role.can("this user"), patchUser)
        .delete(role.can("this user"), deleteUser);
		
	router.route('/:username/pokemons')
        .get(role.can("this user"), getCaughtPokemons)
		
	router.route('/:username/pokemons/:pokemonID')
        .post(role.can("this user"), catchPokemon)

    return router;
}