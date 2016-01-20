function queen(rank, file, side, type) {
	return new piece(rank, file, side, type, function (board) {

		var m = [];
		var k = [];

		for (var r = this.rank + 1; r < 8; r++) {
			if (!board[r][this.file].piece)
				m.push({
					rank: r,
					file: this.file
				});
			else {
				if (board[r][this.file].piece.side !== this.side)
					k.push({
						rank: r,
						file: this.file
					});
				break;
			}
		}

		for (var r = this.rank - 1; r >= 0; r--) {
			if (!board[r][this.file].piece)
				m.push({
					rank: r,
					file: this.file
				});
			else {
				if (board[r][this.file].piece.side !== this.side)
					k.push({
						rank: r,
						file: this.file
					});
				break;
			}
		}

		for (var f = this.file + 1; f < 8; f++) {
			if (!board[this.rank][f].piece)
				m.push({
					rank: this.rank,
					file: f
				});
			else {
				if (board[this.rank][f].piece.side !== this.side)
					k.push({
						rank: this.rank,
						file: f
					});
				break;
			}
		}

		for (var f = this.file - 1; f >= 0; f--) {
			if (!board[this.rank][f].piece)
				m.push({
					rank: this.rank,
					file: f
				});
			else {
				if (board[this.rank][f].piece.side !== this.side)
					k.push({
						rank: this.rank,
						file: f
					});
				break;
			}
		}

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
