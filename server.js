var http = require("http");
var express = require("express");
var path = require("path");
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.openGames = [];
app.clients = {};

app.use('/static', express.static(path.join(__dirname, '/static/')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/home.html');
});


io.on("connection", function (socket) {
	console.log("connection");

	app.clients[socket.id] = socket;
	app.clients[socket.id].gameIndex = false;

	socket.on("get-list", function () {
		socket.emit("add-games", app.openGames);
	});

	socket.on("new-game", function (data) {
		if (app.clients[socket.id].gameIndex === false) {
			app.clients[socket.id].gameIndex = app.openGames.length;
			app.openGames.push(data);
			io.sockets.emit('add-games', data);
		} else {
			app.openGames[app.clients[socket.id].gameIndex] = data;
			io.sockets.emit('update-list', {
				'index': app.clients[socket.id].gameIndex,
				'game': data
			});
		}
	});

	socket.on("disconnect", function () {
		app.openGames.splice(app.clients[socket.id].gameIndex, 1);

		for (var i in app.clients) {
			if (app.clients[i].gameIndex > app.clients[socket.id].gameIndex)
				app.clients[i].gameIndex -= 1;
		}

		io.sockets.emit('remove-from-list', {
			'index': app.clients[socket.id].gameIndex
		});
		delete app.clients[socket.id];
	});

	socket.on("join-game", function (data) {
		data.owner = '/#' + data.owner;
		data.opponent = '/#' + data.opponent;

		var i = app.clients[data.owner].gameIndex;

		app.openGames.splice(i, 1);

		for (var i in app.clients) {
			if (app.clients[i].gameIndex > i)
				app.clients[i].gameIndex -= 1;
		}

		io.sockets.emit('remove-from-list', {
			'index': i
		});

		app.clients[data.owner].emit("game-created");
		app.clients[data.opponent].emit("game-created");
	});
});

server.listen(3000, function () {
	console.log("listening");
});
