angular.module("chess", [])

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

}]);
