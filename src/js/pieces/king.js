function king(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var steps = [];
		for (var i = -1; i < 2; i++)
			for (var j = -1; j < 2; j++)
				if (i !== 0 || j !== 0)
					steps.push([i, j]);

		for (var x = 0; x < steps.length; x++)
			if (!board[this.rank + steps[x][0]][this.file + steps[x][1]].piece)
				m.push({
					rank: this.rank + steps[x][0],
					file: this.file + steps[x][1]
				});
			else {
				if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.side !== this.side)
					k.push({
						rank: this.rank + steps[x][0],
						file: this.file + steps[x][1]
					});
			}

		return {
			move: m,
			capture: k,
			castle: undefined
		};

	});
}
