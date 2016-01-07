var http = require("http");
var express = require("express");
var path = require("path");
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.openGames = [];

app.use('/static', express.static(path.join(__dirname, '/static/')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/open-games.html');
});

app.get('/game', function (req, res) {
	res.sendFile(__dirname + '/game.html');
});

io.on("connection", function (socket) {
	console.log("connected");

	socket.emit("add-games", app.openGames);

	socket.on("new-game", function (data) {
		app.openGames.push(data);
		io.sockets.emit('add-games', data);
	});

	socket.on("disconnect", function () {
		console.log(socket.id + " is disconnected");
	});
});
io.on("disconnection", function () {
	console.log("disconnected");
});

server.listen(3000, function () {
	console.log("listening");
});
