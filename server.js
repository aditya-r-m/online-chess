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
	console.log("served list");
});

app.get('/game', function (req, res) {
	res.sendFile(__dirname + '/game.html');
	console.log("started game");
});

io.on("connection", function () {
	console.log("connected");
});


server.listen(3000, function () {
	console.log("listening");
});
