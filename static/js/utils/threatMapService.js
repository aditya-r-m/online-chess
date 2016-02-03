angular.module("utils", [])

.service('threatMapService', function () {

    this.hasMoves = function (side, livePieces, board, enPassantData) {

        var moveLists;
        for (var x in livePieces)
            if (livePieces[x].side === side) {
                moveLists = this.refineLegalMoves(board, livePieces[x].legalMoves(board, enPassantData), livePieces[x].rank, livePieces[x].file, side, livePieces[x].type, livePieces[side === 1 ? 0 : 1]);

                for (var y in moveLists)
                    if (moveLists[y])
                        if (moveLists[y].rank || moveLists[y].length > 0)
                            return true;
            }
        return false;
    }

    this.threats = function (board, side) {

        var c = 0;

        var threats = [];

        for (var r = this.rank + 1; r < 8; r++) {
            if (board[r][this.file].piece) {
                if (board[r][this.file].piece.side === side && (board[r][this.file].piece.type === "q" || board[r][this.file].piece.type === "r")) {
                    threats.push({
                        "rank": r,
                        "file": this.file
                    });
                    c++;
                }
                break;
            }
        }

        for (var r = this.rank - 1; r >= 0; r--) {
            if (board[r][this.file].piece) {
                if (board[r][this.file].piece.side === side && (board[r][this.file].piece.type === "q" || board[r][this.file].piece.type === "r")) {
                    threats.push({
                        "rank": r,
                        "file": this.file
                    });
                    c++;
                }
                break;
            }
        }

        for (var f = this.file + 1; f < 8; f++) {
            if (board[this.rank][f].piece) {
                if (board[this.rank][f].piece.side === side && (board[this.rank][f].piece.type === "q" || board[this.rank][f].piece.type === "r")) {
                    threats.push({
                        "rank": this.rank,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }

        for (var f = this.file - 1; f >= 0; f--) {
            if (board[this.rank][f].piece) {
                if (board[this.rank][f].piece.side === side && (board[this.rank][f].piece.type === "q" || board[this.rank][f].piece.type === "r")) {
                    threats.push({
                        "rank": this.rank,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }


        for (var r = this.rank + 1, f = this.file + 1; r < 8 && f < 8; r++, f++) {
            if (board[r][f].piece) {
                if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b")) {
                    threats.push({
                        "rank": r,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }

        for (var r = this.rank - 1, f = this.file + 1; r >= 0 && f < 8; r--, f++) {
            if (board[r][f].piece) {
                if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b")) {
                    threats.push({
                        "rank": r,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }

        for (var r = this.rank + 1, f = this.file - 1; f >= 0 && r < 8; r++, f--) {
            if (board[r][f].piece) {
                if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b")) {
                    threats.push({
                        "rank": r,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }

        for (var r = this.rank - 1, f = this.file - 1; f >= 0 && r >= 0; f--, r--) {
            if (board[r][f].piece) {
                if (board[r][f].piece.side === side && (board[r][f].piece.type === "q" || board[r][f].piece.type === "b")) {
                    threats.push({
                        "rank": r,
                        "file": f
                    });
                    c++;
                }
                break;
            }
        }

        var steps = [];

        for (var i = -2; i < 3; i++)
            if (i != 0)
                for (var j = -2; j < 3; j++)
                    if (j != 0)
                        if (i !== j && i !== -j && (this.rank + i >= 0 && this.rank + i < 8) && (this.file + j >= 0 && this.file + j < 8))
                            steps.push([i, j]);

        for (var x = 0; x < steps.length; x++)
            if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece)
                if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.side === side && (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.type === "n")) {
                    threats.push({
                        "rank": this.rank + steps[x][0],
                        "file": this.file + steps[x][1]
                    });
                    c++;
                }
        var stepsK = [];


        if (this.rank - side >= 0 && this.rank - side < 8) {
            if (this.file > 0)
                stepsK.push([-side, -1]);
            if (this.file < 7)
                stepsK.push([-side, 1]);
        }
        for (var x = 0; x < stepsK.length; x++)
            if (board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece && board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece.side === side && (board[this.rank + stepsK[x][0]][this.file + stepsK[x][1]].piece.type === "p")) {
                threats.push({
                    "rank": this.rank + stepsK[x][0],
                    "file": this.file + stepsK[x][1]
                });
                c++;
            }

        steps = [];

        for (var i = -1; i < 2; i++)
            for (var j = -1; j < 2; j++)
                if ((i !== 0 || j !== 0) && (this.rank + i >= 0 && this.rank + i < 8) && (this.file + j >= 0 && this.file + j < 8))
                    steps.push([i, j]);

        for (var x = 0; x < steps.length; x++)
            if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece)
                if (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.side === side && (board[this.rank + steps[x][0]][this.file + steps[x][1]].piece.type === "k")) {
                    threats.push({
                        "rank": this.rank + steps[x][0],
                        "file": this.file + steps[x][1]
                    });
                    c++;
                }
        return {
            "count": c,
            "list": threats
        };
    }

    this.refineLegalMoves = function (board, moveLists, rank, file, side, type, king) {

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

            var threats = board[rank][file].threats(board, -side).list;
            for (var x in threats) {
                var threateningPiece = board[threats[x].rank][threats[x].file].piece;
                if (threateningPiece.type === 'q' || threateningPiece.type === 'b' || threateningPiece.type === 'r') {
                    var inr, inf;
                    if (threateningPiece.rank > rank)
                        inr = -1;
                    else if (threateningPiece.rank === rank)
                        inr = 0;
                    else
                        inr = 1;

                    if (threateningPiece.file > file)
                        inf = -1;
                    else if (threateningPiece.file === file)
                        inf = 0;
                    else
                        inf = 1;

                    var tr = rank + inr;
                    var tf = file + inf;

                    outer: for (var ii in moveLists)
                        if (moveLists[ii]) {
                            if (Array.isArray(moveLists[ii])) {
                                for (var jj in moveLists[ii])
                                    if (moveLists[ii][jj].rank === tr && moveLists[ii][jj].file === tf) {
                                        moveLists[ii].splice(jj, 1);
                                        break outer;
                                    }
                            }
                        }
                }
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
                    if (moveLists[x])
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


            var threatsToKing = board[king.rank][king.file].threats(board, -side);
            if (threatsToKing.count > 0) {
                if (threatsToKing.count > 1) {
                    moveLists.capture = [];
                    moveLists.move = [];
                } else {
                    var canCaptureAttacker = false;
                    var attacker = board[threatsToKing.list[0].rank][threatsToKing.list[0].file].piece;
                    for (var i = 0; i < moveLists.capture.length; i++)
                        if (moveLists.capture[i].file === attacker.file && moveLists.capture[i].rank === attacker.rank)
                            canCaptureAttacker = true;

                    if (canCaptureAttacker)
                        moveLists.capture = [{
                            "rank": attacker.rank,
                            "file": attacker.file
                    }];
                    else
                        moveLists.capture = [];


                    var criticalSquares = [];

                    if (attacker.type === 'q' || attacker.type === 'r' || attacker.type === 'b') {

                        if (king.rank === attacker.rank) {
                            inr = 0;
                            inf = -1;
                            if (king.file > attacker.file)
                                inf = 1;
                        } else if (king.file === attacker.file) {
                            inf = 0;
                            inr = -1;
                            if (king.rank > attacker.rank)
                                inr = 1;
                        } else if (king.rank + king.file === attacker.rank + attacker.file) {
                            inr = -1;
                            inf = 1;
                            if (king.rank > attacker.rank) {
                                inr = 1;
                                inf = -1;
                            }
                        } else if (king.rank - king.file === attacker.rank - attacker.file) {
                            inr = -1;
                            inf = -1;
                            if (king.rank > attacker.rank) {
                                inr = 1;
                                inf = 1;
                            }
                        }

                        r = attacker.rank + inr;
                        f = attacker.file + inf;
                        while (!board[r][f].piece) {
                            criticalSquares.push({
                                "rank": r,
                                "file": f
                            });
                            r += inr;
                            f += inf;
                        }
                        var found = false;
                        for (var x = 0; x < criticalSquares.length;) {
                            found = false;
                            for (var ii in moveLists.move)
                                if (criticalSquares[x].rank === moveLists.move[ii].rank && criticalSquares[x].file === moveLists.move[ii].file) {
                                    found = true;
                                    break;
                                }
                            if (!found)
                                criticalSquares.splice(x, 1);
                            else
                                x++;
                        }
                    }
                    moveLists.move = criticalSquares;
                }
            }
        }
        return moveLists;
    }

});
