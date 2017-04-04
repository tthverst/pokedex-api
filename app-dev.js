var app = require('./app');
var port = process.env.PORT || 8080;
var _ = require('underscore');

var server = app.listen(port);
console.log('The magic happens on port ' + port);

var io = require('socket.io').listen(server);

//socket.io
io.on('connection', function(socket){
	socket.on('catchAttempt', function(data){
		if(data.distance <= 25) {
			
			if(_.random(1) >= 0.5){
				io.emit('pokemonCaught', data.pokemon);
			}
			else {
				io.emit('pokemonNotCaught');
			}
			
		}
	});
});