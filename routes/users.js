var express = require('express');
var router = express();
var path = require('path');
var _ = require('underscore');
var handleError;
var async = require('async');

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
        res.redirect('/profile');
    });
}

function postUser(req, res) {
    var user = new User();


}

function patchUser(req, res) {
    User.findOne({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 404, "User not found."); }

        user.local.username = req.body.username;
        user.roles = [req.body.roles];

        user.save(function (err) {
            if (err) { return handleError(err, res, 400, "User is not updated. You might have chosen an username that already exists."); }
            res.status(200).redirect('/users');
        })
    });
}

function deleteUser(req, res) {
    User.remove({ "local.username": req.params.username }, function (err, user) {
        if (err) { return handleError(err, res, 400, "Pokemon is not removed."); }
        res.status(200).send("Pokemon removed");
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

    return router;
}