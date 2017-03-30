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

function postLocation(req, res) {
    var location = new Location();
	
    location.lat = req.body.lat;
    location.lng = req.body.lng;
    location.pokemon_id = req.body.pokemon_id;
	
    location.save(function (err) {
        if (err) { console.log(err); return handleError(err, res, 400, "Location is not added."); }
        res.status(201).send("Location created");
    });
}

function patchLocation(req, res) {
    Location.findOne({ "_id": req.params.locationID }, function (err, location) {
        if (err) { return handleError(err, res, 404, "Location not found."); }

        location.lat = req.body.lat;
        location.lng = req.body.lng;

        location.save(function (err) {
            if (err) { return handleError(err, res, 400, "Location is not updated."); }
			res.status(201).send("Location updated");
        })
    });
}

function deleteLocation(req, res) {
    Location.remove({ "_id": req.params.locationID }, function (err, location) {
        if (err) { return handleError(err, res, 400, "Location is not removed."); }
        res.status(201).send("Location removed");
    });
}

module.exports = function (model, role, errCallback) {
    Location = model.Location;
    handleError = errCallback;

    // Routing
    router.route('/')
        .get(getLocations)
		.post(postLocation);
		
	router.route('/:locationID')
        .patch(patchLocation)
		.delete(deleteLocation);

    return router;
}