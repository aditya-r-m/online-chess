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
    })
}])
