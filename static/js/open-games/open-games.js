angular.module("openGames", [])

.service("socketService", function () {
	this.socket = io();
})


.controller("listController", ['$scope', 'socketService', function ($scope, socketService) {

	$scope.list = [];

	$scope.userName = "";

	$scope.failed = false;

	socketService.socket.on("add-games", function (data) {
		$scope.list = $scope.list.concat(data);
		$scope.$apply();
	});

	$scope.createGame = function () {
		if ($scope.userName && $scope.userName != "") {
			$scope.failed = false;
			socketService.socket.emit("new-game", {
				'player': $scope.userName,
				'side': ((Math.random() > 0.5) ? 'black' : 'white'),
				'id': socketService.socket.id
			});
		} else {
			$scope.failed = true;
		}
	}

	$scope.joinGame = function (id) {
		socketService.socket.emit("join-game", {
			'id1': id,
			'id2': socketService.socket.id
		});
	}

}]);
