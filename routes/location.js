var express = require('express');
var router = express();
var _ = require('underscore');
var handleError;

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

function getLocation(req, res) {
    Location.findOne({ "_id": req.params.locationID }, function (err, location) {
        if (err) { return handleError(err, res, 404, "Location not found."); }
        res.status(200).json(location);
    });
}

function getPokemon(req, res){
	Location
		.findById(req.params.locationID)
		.populate('pokemon')
		.exec(function(err, data){
			if(err){ return handleError(req, res, 500, err); }

			res.json(data.pokemon);
		});
}

function postLocation(req, res) {
    var location = new Location();
	
    location.lat = req.body.lat;
    location.lng = req.body.lng;
    location.pokemon = req.body.pokemon;
	
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
		.post(role.can("location management"), postLocation);
		
	router.route('/:locationID')
		.get(getLocation)
        .patch(role.can("location management"), patchLocation)
		.delete(role.can("location management"), deleteLocation);
		
	router.route('/:locationID/pokemon')
		.get(getPokemon)

    return router;
}