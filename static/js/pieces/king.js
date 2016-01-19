function king(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var steps = [];
		var m = [];
		var k = [];
		var c = [];
		var rookAMoved = false,
			rookHMoved = false,
			kingMoved = false;

		this.inCheck = function (board) {
			return board[this.rank][this.file].threatCount(-this.side);
		};

		for (var i = -1; i < 2; i++)
			for (var j = -1; j < 2; j++)
				if ((i !== 0 || j !== 0) && (this.rank + i >= 0 && this.rank + i < 8) && (this.file + j >= 0 && this.file + j < 8))
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

		if (!kingMoved && !(this.inCheck() > 0)) {
			if (!rookAMoved) {
				if (!board[this.rank][2] && !board[this.rank][1])
					if (board[this.rank][2].threatCount(-this.side) === 0 && board[this.rank][1].threatCount(-this.side) === 0)
						c.push({
							rank: this.rank,
							file: 1
						});
			}
			if (!rookHMoved) {
				if (!board[this.rank][4] && !board[this.rank][5])
					if (board[this.rank][4].threatCount(-this.side) === 0 && board[this.rank][5].threatCount(-this.side) === 0)
						c.push({
							rank: this.rank,
							file: 5
						});
			}
		}

		return {
			move: m,
			capture: k,
			castle: c
		};

	});
}
