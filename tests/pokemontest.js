var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../app.js');

function makeRequest(route, statusCode, done) {
	request(app)
		.get(route)
		.set({ 'Content-Type': 'application/json' })
		.expect(statusCode)
		.end(function (err, res) {
			if (err) { return done(err); }

			done(null, res);
		});
};

describe('Testing pokemon route', function () {
	describe('without params', function () {
		it('should return pokemons', function (done) {

			makeRequest('/pokemons', 200, function (err, res) {
				if (err) { return done(err); }
				console.log(res.body);
				done();
			});
		});
	});

	describe('with invalid name param', function () {
		it('should return 404 when name is invalid', function (done) {
			makeRequest('/pokemons/bulbasaurr', 404, function (err, res) {
				if (err) { return done(err); }
				done();
			});
		});

		it('should return 200 when name is valid', function (done) {
			makeRequest('/pokemons/bulbasaur', 200, function(err, res) {
				if (err) { return done(err); }
				done();
			});
		});
	});
});