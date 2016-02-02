angular.module("chess")

.controller('resultController', ['$scope', 'winner', function ($scope, winner) {
    $scope.winner = winner;
}]);