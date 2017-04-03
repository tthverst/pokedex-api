var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('./app.js');

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing pokemon route', function(){
	describe('without params', function(){
		it('should return pokemons', function(done){
			var today = new Date();
			var expectedString = 
				(today.getDate() < 10 ? '0' : '') + 
				today.getDate() + '-' + 
				(today.getMonth() + 1 < 10 ? '0' : '') + 
				(today.getMonth() + 1) + '-' + 
				today.getFullYear();

			makeRequest('/', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('date');
				expect(res.body.date).to.not.be.undefined;
				expect(res.body.date).to.equal(expectedString);
				done();
			});
		});
	});

	describe('with invalid params', function(){
		it('should return 400 when date is invalid', function(done){
			makeRequest('/35/2/2000', 400, done);
		});

		it('should return 400 when date is not numeric', function(done){
			makeRequest('/test/me/now', 400, done);
		});
	});
});