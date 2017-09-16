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


.service("socketService", ['$timeout', function ($timeout) {
    this.socket = io();
    
    this.emit = function(){
        this.socket.emit.apply(this.socket, arguments);
    };

    this.on = function (event, callback) {
        var _callback = function () {
            var args = arguments, self = this;
            $timeout(function(){
                callback.apply(self, args);
            });
        }

        this.socket.on(event, _callback);
    };
}])

.service("gameData", function () {
    this.started = false;
    this.opponent = undefined;
    this.player = undefined;
    this.side = undefined;
    this.turn = false;
    this.picked = false;
    this.enPassant = undefined;
});
