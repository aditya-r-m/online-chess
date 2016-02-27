angular.module("pieceDefinitions")

.factory("rook", ['piece', function (piece) {

    var constructor = function (rank, file, side, type) {
        return piece.create(rank, file, side, type, function (board) {

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


            return {
                move: m,
                capture: k
            };
        });
    };

    return {
        "create": constructor
    }
}]);
