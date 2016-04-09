angular.module("utils")

.service('translatorService', function () {

    this.convertToFEN = function (board, side, kingW, kingB, enPassant, halfMoves, fullMoves) {
        var s = 'position fen ';
        var count = 0;
        for (var i = 7; i > -1; i--) {
            for (var j = 0; j < 8; j++) {
                if (!board[i][j].piece)
                    count++;
                else {
                    if (count > 0) {
                        s += count;
                        count = 0;
                    }
                    s += board[i][j].piece.side === 1 ? board[i][j].piece.type.toUpperCase() : board[i][j].piece.type;
                }
            }
            if (count > 0) {
                s += count;
                count = 0;
            }
            if (i > 0)
                s += '/';
        }
        s += ' ';
        side === 1 ? s += 'b ' : s += 'w ';

        var noneCanCastle = true;
        if (!kingW.kingMoved) {
            if (!kingW.rookAMoved) {
                s += 'K';
                if (!kingW.rookHMoved)
                    s += 'Q';
                noneCanCastle = false;
            } else if (!kingW.rookHMoved) {
                s += 'Q';
                noneCanCastle = false;
            }
        }
        if (!kingB.kingMoved) {
            if (!kingB.rookAMoved) {
                s += 'k';
                if (!kingB.rookHMoved)
                    s += 'q';
                noneCanCastle = false;
            } else if (!kingB.rookHMoved) {
                s += 'q';
                noneCanCastle = false;
            }
        }
        if (noneCanCastle)
            s += '- ';
        else
            s += ' ';

        if (!enPassant)
            s += '- ';
        else {
            s += String.fromCharCode('a'.charCodeAt(0) + enPassant.file);
            s += (enPassant.rank + 1) + ' ';
        }

        s += halfMoves + ' ';
        s += fullMoves;
        return s;
    }
});
