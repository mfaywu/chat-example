var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
    });

io.on('connection', function(socket) { 
	//console.log('a user connected');
	//socket.broadcast.emit('chat message', ' connected');
	
	socket.on('connected message', function(msg) {
		console.log('socket.id is ' + msg);
		socket.broadcast.emit('chat message', msg + ' is connected!');
	    });

	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	    });
	socket.on('disconnect', function(msg) {
		//console.log('user disconnected');
		io.emit('chat message', 'user disconnected');
	    });
    });

http.listen(3000, function() {
	console.log('listening on *:3000');
    });