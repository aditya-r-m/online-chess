function refineLegalMoves(board, moveLists, rank, file, side, type, king) {
    console.log(moveLists);
    if (type === 'k') {
        for (var i = 0; i < moveLists.move.length;) {
            if (board[moveLists.move[i].rank][moveLists.move[i].file].threats(board, -side).count > 0)
                moveLists.move.splice(i, 1);
            else
                i++;
        }
        for (var i = 0; i < moveLists.capture.length;) {
            if (board[moveLists.capture[i].rank][moveLists.capture[i].file].threats(board, -side).count > 0)
                moveLists.capture.splice(i, 1);
            else
                i++;
        }
    } else {

        var inr,
            inf,
            straightPin = false,
            diagonalPin = false,
            blockerPresent = false,
            pinned = false;


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

        if (straightPin || diagonalPin)
            for (var r = rank - inr, f = file - inf; r >= 0 && r < 8 && f >= 0 && f < 8; r -= inr, f -= inf) {
                if (board[r][f].piece) {
                    if (board[r][f].piece === king)
                        break;
                    else {
                        blockerPresent = true;
                        break;
                    }
                }
            }

        if (!blockerPresent && (straightPin || diagonalPin)) {
            for (var r = rank + inr, f = file + inf; r >= 0 && r < 8 && f >= 0 && f < 8; r += inr, f += inf)
                if (board[r][f].piece && board[r][f].piece.side === -side) {
                    if (board[r][f].piece.type === 'q' || (diagonalPin && board[r][f].piece.type === 'b') || (straightPin && board[r][f].piece.type === 'r'))
                        pinned = true;
                    break;
                }
        }

        if (pinned) {

            for (var x in moveLists)
                for (var i = 0; i < moveLists[x].length;) {
                    if (straightPin) {
                        if (inr === 0) {
                            if (moveLists[x][i].rank !== rank) {
                                moveLists[x].splice(i, 1);
                                i--;
                            }
                        } else {
                            if (moveLists[x][i].file !== file) {
                                moveLists[x].splice(i, 1);
                                i--;

                            }
                        }
                    }
                    if (diagonalPin) {
                        if (inr === inf) {
                            if (moveLists[x][i].rank - moveLists[x][i].file !== rank - file) {
                                moveLists[x].splice(i, 1);
                                i--;
                            }
                        } else {
                            if (moveLists[x][i].rank + moveLists[x][i].file !== rank + file) {
                                moveLists[x].splice(i, 1);
                                i--;
                            }
                        }
                    }
                    i++;
                }

        }


        if (board[king.rank][king.file].threats(board, -side).count > 0) {

        }
    }
    return moveLists;
}
