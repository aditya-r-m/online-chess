var http = require("http");
var express = require("express");
var path = require("path");
var app = express();


app.use('/static', express.static(path.join(__dirname, '/src/')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/home.html');
	console.log("served file");
});

app.listen(3000, function () {
	console.log("listening");
});
