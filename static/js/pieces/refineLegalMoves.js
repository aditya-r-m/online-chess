function refineLegalMoves(board, moveLists, rank, file, side, type) {
	if (type === 'k') {
		for (var i = 0; i < moveLists.move.length;) {
			if (board[moveLists.move[i].rank][moveLists.move[i].file].threatCount(board, -side) > 0)
				moveLists.move.splice(i, 1);
			else
				i++;
		}
		for (var i = 0; i < moveLists.capture.length;) {
			if (board[moveLists.capture[i].rank][moveLists.capture[i].file].threatCount(board, -side) > 0)
				moveLists.move.splice(i, 1);
			else
				i++;
		}
	}
	return moveLists;
}
