angular.module("chess")

.controller('resultController', ['$scope', 'winner', function ($scope, winner, winningPlayer) {
    $scope.winner = winner;
    $scope.winningPlayer = winningPlayer;
}]);