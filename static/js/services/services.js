angular.module("chess")

.service("socketService", function () {
    this.socket = io();
})

.service("gameData", function () {
    this.started = false;
    this.opponent = undefined;
    this.player = undefined;
    this.side = undefined;
    this.turn = false;
    this.picked = false;
    this.enPassant = undefined;
})
