var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
    });

io.on('connection', function(socket) { 

	var username;
	
	socket.on('connected message', function(msg) {
		username = socket.id;
		console.log('client ' + username + ' has connected');
		socket.broadcast.emit('chat message', username + ' is connected!');
		socket.emit('chat message', 'You have joined the chat channel!');
	    });

	socket.on('chat message', function(msg) {
		if (msg.charAt(0) == '/') {
		    var pos = msg.indexOf(":");
		    var cmd = msg.substring(1, pos);
		    switch (cmd) {
		    case "username":
			var prev_username = username;
			username = msg.substring(11, msg.length);
			socket.broadcast.emit('chat message', prev_username + ' changed their username to ' + username);
			socket.emit('chat message', 'You have changed your username to: ' + username);
			break;
		    case "sendto":
			var sub_msg = msg.substring(pos+2, msg.length);
			var pos1 = newmsg.indexOf(' ');
			var receiver = sub_msg.substring(0, pos1);
			//			socket.broadcast.to(receiver).emit('chat message', 
			break;
		    default:
			socket.emit('chat message', 'Invalid command.');
			break;
		    }
		} else {
		 	 socket.emit('chat message', 'You: ' + msg);
			 socket.broadcast.emit('chat message', username + ': ' + msg);
		}
	    });
	socket.on('disconnect', function(msg) {
		//console.log('user disconnected');
		io.emit('chat message', 'user disconnected');
	    });
    });

http.listen(3000, function() {
	console.log('listening on *:3000');
    });