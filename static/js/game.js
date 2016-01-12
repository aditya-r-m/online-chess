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

.service("gameData", function () {
	this.started = false;
	this.opponent = undefined;
	this.player = undefined;
	this.side = undefined;
	this.turn = false;
	this.picked = false;
})

.controller("GameController", ['$scope', 'gameData', function ($scope, gameData) {
	$scope.board = [];
	for (var i = 0; i < 8; i++) {
		$scope.board.push([]);
		for (var j = 0; j < 8; j++)
			$scope.board[i].push({
				'rank': i,
				'file': j
			});
	}

	$scope.data = gameData;

	$scope.livePieces = new Array(32);
	$scope.capturedPieces = [];

	$scope.livePieces[0] = $scope.board[0][0].piece = new rook(0, 0, 1, 'r');
	$scope.livePieces[1] = $scope.board[0][1].piece = new knight(0, 1, 1, 'n');
	$scope.livePieces[2] = $scope.board[0][2].piece = new bishop(0, 2, 1, 'b');
	$scope.livePieces[3] = $scope.board[0][3].piece = new queen(0, 3, 1, 'q');
	$scope.livePieces[4] = $scope.board[0][4].piece = new king(0, 4, 1, 'k');
	$scope.livePieces[5] = $scope.board[0][5].piece = new bishop(0, 5, 1, 'b');
	$scope.livePieces[6] = $scope.board[0][6].piece = new knight(0, 6, 1, 'n');
	$scope.livePieces[7] = $scope.board[0][7].piece = new rook(0, 7, 1, 'r');

	for (var i = 0; i < 8; i++)
		$scope.livePieces[8 + i] = $scope.board[1][i].piece = new pawn(1, i, 1, 'p');

	for (var i = 0; i < 8; i++)
		$scope.livePieces[16 + i] = $scope.board[6][i].piece = new pawn(6, i, -1, 'p');

	$scope.livePieces[24] = $scope.board[7][0].piece = new rook(7, 0, -1, 'r');
	$scope.livePieces[25] = $scope.board[7][1].piece = new knight(7, 1, -1, 'n');
	$scope.livePieces[26] = $scope.board[7][2].piece = new bishop(7, 2, -1, 'b');
	$scope.livePieces[27] = $scope.board[7][3].piece = new queen(7, 3, -1, 'q');
	$scope.livePieces[28] = $scope.board[7][4].piece = new king(7, 4, -1, 'k');
	$scope.livePieces[29] = $scope.board[7][5].piece = new bishop(7, 5, -1, 'b');
	$scope.livePieces[30] = $scope.board[7][6].piece = new knight(7, 6, -1, 'n');
	$scope.livePieces[31] = $scope.board[7][7].piece = new rook(7, 7, -1, 'r');

	$scope.selectSquare = function (r, f) {
		if (!$scope.data.picked) {
			if ($scope.board[r][f].piece) {
				$scope.data.picked = {
					"r": r,
					"f": f
				};
				$scope.data.lists = $scope.board[r][f].piece.legalMoves($scope.board);
				for (var x in $scope.data.lists.move)
					$scope.board[$scope.data.lists.move[x].rank][$scope.data.lists.move[x].file].highlightedMove = true;
				for (var x in $scope.data.lists.capture)
					$scope.board[$scope.data.lists.capture[x].rank][$scope.data.lists.capture[x].file].highlightedCapture = true;
			}

		} else {
			if ($scope.board[r][f].highlightedMove) {
				$scope.board[r][f].piece = $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece;
				$scope.board[$scope.data.picked.r][$scope.data.picked.f].piece = undefined;
				$scope.board[r][f].piece.rank = r;
				$scope.board[r][f].piece.file = f;
			} else if ($scope.board[r][f].highlightedCapture) {

				$scope.capturedPieces.push($scope.board[r][f].piece);
				$scope.livePieces.splice($scope.livePieces.indexOf($scope.board[r][f].piece), 1);

				$scope.board[r][f].piece = $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece;
				$scope.board[$scope.data.picked.r][$scope.data.picked.f].piece = undefined;
				$scope.board[r][f].piece.rank = r;
				$scope.board[r][f].piece.file = f;

			}
			$scope.data.picked = false;
			if ($scope.data.lists) {
				for (var x in $scope.data.lists.move)
					$scope.board[$scope.data.lists.move[x].rank][$scope.data.lists.move[x].file].highlightedMove = false;
				for (var x in $scope.data.lists.capture)
					$scope.board[$scope.data.lists.capture[x].rank][$scope.data.lists.capture[x].file].highlightedCapture = false;

			}
		}
	};

}])

.controller("listController", ['$scope', 'socketService', 'gameData', '$state', function ($scope, socketService, gameData, $state) {

	$scope.list = [];

	$scope.userName = "";

	$scope.failed = false;

	socketService.socket.on("connect", function () {
		$scope.id = socketService.socket.id;
		$scope.$apply();
	});

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

	socketService.socket.on("game-created", function (data) {
		gameData.started = true;

		if (data) {
			gameData.opponent = data.player;

			gameData.player = $scope.userName === "" ? "Anonymous" : $scope.userName;

			gameData.side = (data.side == "white") ? -1 : 1;

			gameData.turn = (data.side == "white") ? false : true;
		}

		$state.go("game");
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

	$scope.joinGame = function (id, opponent, side) {

		gameData.opponent = opponent;

		gameData.player = $scope.userName === "" ? "Anonymous" : $scope.userName;

		gameData.side = (side == "white") ? 1 : -1;

		gameData.turn = (side == "white") ? true : false;

		gameData.started = true;

		socketService.socket.emit("join-game", {
			'owner': id,
			'opponent': socketService.socket.id,
			'gameData': gameData
		});
	}
}]);
