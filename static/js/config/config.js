angular.module("chess")

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/list");


    $stateProvider.state("list", {
        url: "/list",
        templateUrl: "/static/templates/list.html"
    })

    .state("game", {
        url: "/game",
        templateUrl: "/static/templates/game.html"
    });
}])


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
});
