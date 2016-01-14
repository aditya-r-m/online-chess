function piece(rank, file, side, type, legalMoves) {
	this.rank = rank;
	this.file = file;
	this.side = side;
	this.type = type;
	this.legalMoves = legalMoves;
}

function threatCount(board, side) {

	var c = 0;

	for (var r = this.rank + 1; r < 8; r++) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "r"))
				c++;
			break;
		}
	}

	for (var r = this.rank - 1; r >= 0; r--) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "r"))
				c++;
			break;
		}
	}

	for (var f = this.file + 1; f < 8; f++) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "r"))
				c++;
			break;
		}
	}

	for (var f = this.file - 1; f >= 0; f--) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "r"))
				c++;
			break;
		}
	}


	for (var r = this.rank + 1, f = this.file + 1; r < 8 && f < 8; r++, f++) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b"))
				c++;
			break;
		}
	}

	for (var r = this.rank - 1, f = this.file + 1; r >= 0 && f < 8; r--, f++) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b"))
				c++;
			break;
		}
	}

	for (var r = this.rank + 1, f = this.file - 1; f >= 0 && r < 8; r++, f--) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b"))
				c++;
			break;
		}
	}

	for (var r = this.rank - 1, f = this.file - 1; f >= 0 && r >= 0; f--, r--) {
		if (board[r][f].piece) {
			if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b"))
				c++;
			break;
		}
	}

	var steps = [];

	for (var i = -2; i < 3; i++)
		if (i != 0)
			for (var j = -2; j < 3; j++)
				if (j != 0)
					if (i !== j && i !== -j && (this.rank + i >= 0 && this.rank + i < 8) && (this.file + j >= 0 && this.file + j < 8))
						steps.push([i, j]);

	for (var x = 0; x < steps.length; x++)
		if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece)
			if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.side === side && (board[r][f].piece.type === "n"))
				c++;

	var stepsK = [];


	if (this.file > 0)
		stepsK.push([-side, -1]);
	if (this.file < 7)
		stepsK.push([-side, 1]);

	for (var x = 0; x < stepsK.length; x++)
		if (board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece && board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece.side === side && (board[r][f].piece.type === "p"))
			c++;

	return c;
}
