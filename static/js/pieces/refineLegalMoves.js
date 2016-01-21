function refineLegalMoves(board, moveLists, rank, file, side, type, king) {
    if (type === 'k') {
        for (var i = 0; i < moveLists.move.length;) {
            if (board[moveLists.move[i].rank][moveLists.move[i].file].threats(board, -side).count > 0)
                moveLists.move.splice(i, 1);
            else
                i++;
        }
        for (var i = 0; i < moveLists.capture.length;) {
            if (board[moveLists.capture[i].rank][moveLists.capture[i].file].threats(board, -side).count > 0)
                moveLists.move.splice(i, 1);
            else
                i++;
        }
    } else {

        var inr,
            inf,
            straightPin = false,
            diagonalPin = false;

        if (king.rank === rank) {
            inr = 0;
            inf = 1;
            if (king.file > file)
                inf = -1;
            straightPin = true;
        } else if (king.file === file) {
            inf = 0;
            inr = 1;
            if (king.rank > rank)
                inr = -1;
            straightPin = true;
        } else if (king.rank + king.file === rank + file) {
            inr = 1;
            inf = -1;
            if (king.rank > rank) {
                inr = -1;
                inf = 1;
            }
            diagonalPin = true;
        } else if (king.rank - king.file === rank - file) {
            inr = 1;
            inf = 1;
            if (king.rank > rank) {
                inr = -1;
                inf = -1;
            }
            diagonalPin = true;
        }


        if (board[king.rank][king.file].threats(board, -side).count > 0) {

        }
    }
    return moveLists;
}
