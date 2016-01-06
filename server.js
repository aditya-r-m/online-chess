var http = require("http");
var express = require("express");
var path = require("path");
var app = express();


app.use('/static', express.static(path.join(__dirname, '/static/')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/open-games.html');
	console.log("served file");
});

app.listen(3000, function () {
	console.log("listening");
});
