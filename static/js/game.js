angular.module("chess", ["ui.router"])

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

.service("socketService", function () {
	this.socket = io();
})

.controller("GameController", ['$scope', function ($scope) {
	$scope.board = [];
	for (var i = 0; i < 8; i++) {
		$scope.board.push([]);
		for (var j = 0; j < 8; j++)
			$scope.board[i].push({
				'rank': i,
				'file': j
			});
	}

	$scope.board[0][0].piece = new rook(0, 0, 1, 'r');
	$scope.board[0][1].piece = new knight(0, 1, 1, 'n');
	$scope.board[0][2].piece = new bishop(0, 2, 1, 'b');
	$scope.board[0][3].piece = new queen(0, 3, 1, 'q');
	$scope.board[0][4].piece = new king(0, 4, 1, 'k');
	$scope.board[0][5].piece = new bishop(0, 5, 1, 'b');
	$scope.board[0][6].piece = new knight(0, 6, 1, 'n');
	$scope.board[0][7].piece = new rook(0, 7, 1, 'r');

	for (var i = 0; i < 8; i++)
		$scope.board[1][i].piece = new pawn(1, i, 1, 'p');

	for (var i = 0; i < 8; i++)
		$scope.board[6][i].piece = new pawn(6, i, -1, 'p');

	$scope.board[7][0].piece = new rook(0, 0, -1, 'r');
	$scope.board[7][1].piece = new knight(0, 1, -1, 'n');
	$scope.board[7][2].piece = new bishop(0, 2, -1, 'b');
	$scope.board[7][3].piece = new queen(0, 3, -1, 'q');
	$scope.board[7][4].piece = new king(0, 4, -1, 'k');
	$scope.board[7][5].piece = new bishop(0, 5, -1, 'b');
	$scope.board[7][6].piece = new knight(0, 6, -1, 'n');
	$scope.board[7][7].piece = new rook(0, 7, -1, 'r');

}])

.controller("listController", ['$scope', 'socketService', function ($scope, socketService) {

	$scope.list = [];

	$scope.userName = "";

	$scope.failed = false;

	socketService.socket.emit("get-list");

	socketService.socket.on("add-games", function (data) {
		$scope.list = $scope.list.concat(data);
		$scope.$apply();
	});

	socketService.socket.on("update-list", function (data) {
		$scope.list[data.index] = data.game;
		$scope.$apply();
	});

	socketService.socket.on("remove-from-list", function (data) {
		$scope.list.splice(data.index, 1);
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
}]);;
