function knight(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var steps = [];
		for (var i = -2; i < 3; i++)
			if (i != 0)
				for (var j = -2; j < 3; j++)
					if (j != 0)
						if (i !== j && (this.rank + i >= 0 && this.rank + i < 8) && (this.file + j >= 0 && this.file + j < 8))
							steps.push([i, j]);

		for (var x = 0; x < steps.length; x++)
			if (!board[this.rank + steps[x][0]][this.file + steps[x][1]].piece)
				m.push({
					rank: this.rank + steps[x][0],
					file: this.file + steps[x][1]
				});
			else if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.side !== this.side)
			k.push({
				rank: this.rank + steps[x][0],
				file: this.file + steps[x][1]
			});


		return {
			move: m,
			capture: k,
			castle: undefined
		};
	});
}
