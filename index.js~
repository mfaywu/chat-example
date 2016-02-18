var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
    });

var clients = [];

io.on('connection', function(socket) { 
	var client = {username: null, id: null};
	
	socket.on('connected message', function(msg) {
		client.username = 'NoName';
		client.id = socket.id;
		socket.broadcast.emit('chat message', client.username + ' is connected!');
		socket.emit('chat message', 'You have joined the chat channel!');
		socket.emit('chat message', 'Enter /help: to see a list of the possible commands.');
		clients.push(client);
	    });

	socket.on('chat message', function(msg) {
		if (msg.charAt(0) == '/') {
		    var pos = msg.indexOf(":");
		    var cmd = msg.substring(1, pos);
		    switch (cmd) {
		    case "help":
			socket.emit('chat message', 'Here are possible commands:');
			socket.emit('chat message', '/username: <name> to change your username');
			socket.emit('chat message', '/sendto: <username> <message> to send a private message to someone');
			socket.emit('chat message', '/whois: to see who is online');
			break;
		    case "username":
			var prev_username = client.username;
			var new_username = msg.substring(11, msg.length);
			if (prev_username == new_username) {
			    socket.emit('chat message', 'You are already ' + prev_username);
			}
			else {
			    var existing_client = clients.filter(function(person) {return person.username.toLowerCase() == new_username.toLowerCase();})[0];
			    if (existing_client) {
				socket.emit('chat message', new_username + ' is already taken. Please choose a different username.');
			    }
			    else {
				client.username = new_username;
				socket.broadcast.emit('chat message', prev_username + ' changed their username to ' + client.username);
				socket.emit('chat message', 'You have changed your username to: ' + client.username);
			    }
			}
			break;
		    case "sendto":
			var sub_msg = msg.substring(pos+2, msg.length);
			var pos1 = sub_msg.indexOf(' ');
			var receiver = sub_msg.substring(0, pos1);
			var receiver_client = clients.filter(function(person) {return person.username.toLowerCase() == receiver.toLowerCase();})[0];
			if (receiver_client) {
			    var text_msg = sub_msg.substring(receiver.length+1, sub_msg.length);
			    var receiver_id = receiver_client.id;
			    socket.broadcast.to(receiver_id).emit('chat message', 'PM ' + client.username + ': ' + text_msg);
			    socket.emit('chat message', 'PM You to ' + receiver_client.username + ': ' + text_msg);
			}
			else {
			    socket.emit('chat message', receiver_client + ' is not in this chat channel.');
			}
		        break;
		    case "whois":
			socket.emit('chat message', 'People available online now: ');
			var index;
			for (index = 0; index < clients.length; index++) {
			    socket.emit('chat message', clients[index].username);
			}
			break;
		    default:
			socket.emit('chat message', 'Invalid command.');
			break;
		    }
		} else {
		 	 socket.emit('chat message', 'You: ' + msg);
			 socket.broadcast.emit('chat message', client.username + ': ' + msg);
		}
	    });
	socket.on('disconnect', function(msg) {
		clients.splice(clients.indexOf(client), 1);
		io.emit('chat message', client.username + ' disconnected');
	    });
    });

http.listen(3000, function() {
	console.log('listening on *:3000');
    });