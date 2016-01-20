function pawn(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board, enPassant) {

		var stepsM = [[this.side, 0]];
		var stepsK = [];
		var m = [];
		var k = [];
		var enPassantCapture = undefined;

		if ((!board[this.rank + this.side][this.file].piece) && ((this.side == 1 && this.rank == 1) || (this.side == -1 && this.rank == 6)))
			stepsM.push([this.side + this.side, 0]);

		if (this.file > 0)
			stepsK.push([this.side, -1]);
		if (this.file < 7)
			stepsK.push([this.side, 1]);

		for (var x = 0; x < stepsM.length; x++)
			if (!board[this.rank + stepsM[x][0]][this.file + stepsM[x][1]].piece)
				m.push({
					rank: this.rank + stepsM[x][0],
					file: this.file + stepsM[x][1]
				});

		for (var x = 0; x < stepsK.length; x++) {
			if (board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece && board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece.side !== this.side)
				k.push({
					rank: this.rank + stepsK[x][0],
					file: this.file + stepsK[x][1]
				});
			else if (enPassant) {
				console.log(this.rank + "  " + this.file + "  " + enPassant);
				if (this.rank + stepsK[x][0] === enPassant.rank && this.file + stepsK[x][1] === enPassant.file)
					enPassantCapture = {
						"rank": enPassant.rank,
						"file": enPassant.file
					};
			}
		}
		return {
			move: m,
			capture: k,
			enPassantCapture: enPassantCapture
		};

	});
}
