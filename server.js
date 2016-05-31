var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:8000/test';

app.use(express.static(__dirname + '/public'));

const PORT=8080;

app.listen(process.env.PORT || 8000);

//////

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
		res.sendFile(__dirname + '/chat.html');
});

// http.listen(8000, function(){
// 		console.log('listening on *:8000');
// });

io.on('connection', function(socket){
		socket.on('chat message', function(msg){
				if (msg.length > 0) {
						io.emit('chat message', msg);	  
				};
		});
});

io.on('connection', function(socket){
		console.log('a user connected');
		socket.on('disconnect', function(){
				console.log('user disconnected');
		});
});

/////
