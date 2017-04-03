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

describe('Testing location route', function () {
	describe('without params', function () {
		it('should return locations', function (done) {
			request(app)
				.get('/locations')
				.set('Accept', '*/*')
				.expect(200)
				.end(function (err, res) {
					if (err) { return done(err); }
					done();
				});
		});
	});

	describe('with invalid name', function () {
		it('should return 404 when name is invalid', function (done) {
			request(app)
				.get('/locations/1')
				.expect(404)
				.end(function (err, res) {
					if (err) { return done(err); }
					done();
				});
		});
	});

	describe('with valid name', function () {
		it('should return 200 when name is valid', function (done) {
			request(app)
				.get('/locations/58e27f8e404c2d7a1f1ca5c6')
				.set('Accept', '*/*')
				.expect(200)
				.end(function (err, res) {
					if (err) { return done(err); }
					done();
				});
		});
	});

	describe('without admin role', function () {
		it('should return 403 access denied', function (done) {
			request(app)
				.delete('locations/58e27f8e404c2d7a1f1ca5c6')
				.expect(403)
				.end(function (err, res) {
					if (err) { return done(err); }
					done(null, res);
				});
		});
	});
});