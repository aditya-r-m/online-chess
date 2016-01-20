function bishop(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var m = [];
		var k = [];

		for (var r = this.rank + 1, f = this.file + 1; r < 8 && f < 8; r++, f++) {
			if (!board[r][f].piece)
				m.push({
					rank: r,
					file: f
				});
			else {
				if (board[r][f].piece.side !== this.side)
					k.push({
						rank: r,
						file: f
					});
				break;
			}
		}

		for (var r = this.rank - 1, f = this.file + 1; r >= 0 && f < 8; r--, f++) {
			if (!board[r][f].piece)
				m.push({
					rank: r,
					file: f
				});
			else {
				if (board[r][f].piece.side !== this.side)
					k.push({
						rank: r,
						file: f
					});
				break;
			}
		}

		for (var r = this.rank + 1, f = this.file - 1; f >= 0 && r < 8; r++, f--) {
			if (!board[r][f].piece)
				m.push({
					rank: r,
					file: f
				});
			else {
				if (board[r][f].piece.side !== this.side)
					k.push({
						rank: r,
						file: f
					});
				break;
			}
		}

		for (var r = this.rank - 1, f = this.file - 1; f >= 0 && r >= 0; f--, r--) {
			if (!board[r][f].piece)
				m.push({
					rank: r,
					file: f
				});
			else {
				if (board[r][f].piece.side !== this.side)
					k.push({
						rank: r,
						file: f
					});
				break;
			}
		}


		return {
			move: m,
			capture: k
		};

	});
}
