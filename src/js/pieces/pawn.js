function pawn(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var stepsM = [[side, 0]];

		if (!board[this.rank + side][this.file] && ((side == 1 && this.rank == 1) || (side == -1 && this.rank == 6)))
			stepsM.push([side + side, 0]);

		var stepsK = [];
		if (this.file > 0)
			stepsK.push([side, -1]);
		if (this.file < 7)
			stepsK.push([side, 1]);

		for (var x = 0; x < stepsM.length; x++)
			if (!board[this.rank + stepsM[x][0]][this.file + stepsM[x][1]].piece)
				m.push({
					rank: this.rank + stepsM[x][0],
					file: this.file + stepsM[x][1]
				});

		for (var x = 0; x < stepsK.length; x++)
			if (board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece.side !== this.side)
				k.push({
					rank: this.rank + stepsK[x][0],
					file: this.file + stepsK[x][1]
				});

		return {
			move: m,
			capture: k,
			castle: undefined
		};

	});
}
