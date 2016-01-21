function hasMoves(side, livePieces, board, enPassantData) {

    var moveLists;
    for (var x in livePieces)
        if (livePieces[x].side === side) {
            moveLists = refineLegalMoves(board, livePieces[x].legalMoves(board, enPassantData), livePieces[x].rank, livePieces[x].file, side, livePieces[x].type, livePieces[side === 1 ? 0 : 1]);

            for (var y in moveLists)
                if (moveLists[y])
                    if (moveLists[y].rank || moveLists[y].length > 0)
                        return true;
        }
    return false;
}
