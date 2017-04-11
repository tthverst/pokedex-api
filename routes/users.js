var express = require('express');
var router = express();
var path = require('path');
var _ = require('underscore');
var jwt = require('jwt-simple');
var jwtauth = require('../auth/jwtauth.js');
var moment = require('moment');
var handleError;

function getUsers(req, res) {
    User.find({}, function (err, users) {
        if (err) { return handleError(err, res, 400, "Users not found."); }

		res.status(200).send({ users: users });
    });
}

function getUser(req, res) {
    User.find({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 404, "User not found."); }
        
		res.status(200).json(user);
		
    });
}

function getToken(req, res) {
	User.findOne({ "local.username": req.body.username }, function (err, user) {
        if (!user) { res.status(404).send("User not found."); return;}
		
		if( !user.validPassword(req.body.password) ) {
			res.status(401).send('Incorrect username/password'); return;
		}
		
		user.local.password = '';
		
		var expires = moment().add(7, 'days').valueOf();
		var token = jwt.encode({
		  iss: user._id,
		  exp: expires
		}, 'OurPokeApi');

		res.status(200).json({
		  token : token,
		  expires: expires,
		  user: user
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

function deleteCaughtPokemon(req,res) {
    User
		.findOne({ "local.username": req.params.username }, function(err, user) {
            if (err) { return handleError(err, res, 404, "Pokemon not found."); }
            
            var index = user.pokemons.indexOf(req.body.pokemon)
            if (index > -1) {
                user.pokemons.splice(index, 1)
            }
            user.save(function(err) {
                if (err) { return err }
                res.status(200).send({ pokemons: user.pokemons });
            })
        });
}

module.exports = function (model, role, errCallback) {
    User = model.User;
    handleError = errCallback;

    // Routing
    router.route('/')
        .get(role.can('user management'), getUsers)

    router.route('/:username')
        .get(getUser)
        .patch(role.can("this user"), patchUser)
        .delete(role.can("this user"), deleteUser);
		
	router.route('/:username/pokemons')
        .get(role.can("this user"), getCaughtPokemons)
		
	router.route('/app/:username/pokemons')
        .get(jwtauth, getCaughtPokemons)
        .delete(jwtauth, deleteCaughtPokemon)
		
	router.route('/:username/pokemons/:pokemonID')
        .post(role.can("this user"), catchPokemon)
		
	router.route('/app/:username/pokemons/:pokemonID')
        .post(jwtauth, catchPokemon)
	
	router.route('/authenticate')
        .post(getToken)

    return router;
}