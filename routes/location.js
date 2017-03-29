var express = require('express');
var router = express();
var path = require('path');
var _ = require('underscore');
var handleError;
var async = require('async');

function getLocations(req, res) {
    Location.find({}, function (err, locations) {
        if (err) { return handleError(err, res, 400, "Locations not found."); }		
		
        res.format({
			'text/html': function(){
				res.status(200).render('locations.handlebars', { locations: locations });
			},
			
			'*/*': function() {
				res.status(200).send({ locations: locations });
			}
		});
    });
}

module.exports = function (model, role, errCallback) {
    Location = model.Location;
    handleError = errCallback;

    // Routing
    router.route('/')
        .get(getLocations);

    return router;
}