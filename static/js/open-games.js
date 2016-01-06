$('#create-new').on('click', function () {
	console.log("clicked it");
});

var socket = io();
socket.on('connect', function () {});
socket.on('event', function (data) {});
socket.on('disconnect', function () {});
