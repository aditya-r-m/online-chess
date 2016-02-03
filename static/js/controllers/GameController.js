angular.module("chess")

.controller("GameController", ['$scope', 'gameData', 'socketService', '$uibModal', 'translatorService', 'threatMapService', function ($scope, gameData, socketService, $uibModal, translatorService, threatMapService) {
    $scope.board = [];
    for (var i = 0; i < 8; i++) {
        $scope.board.push([]);
        for (var j = 0; j < 8; j++)
            $scope.board[i].push({
                'rank': i,
                'file': j,
                'threats': threatMapService.threats
            });
    }

    $scope.data = gameData;

    $scope.data.halfMoves = 0;
    $scope.data.fullMoves = 1;

    $scope.livePieces = new Array(32);
    $scope.capturedPieces = [];

    $scope.livePieces[4] = $scope.board[0][0].piece = rook.create(0, 0, 1, 'r');
    $scope.livePieces[28] = $scope.board[0][1].piece = knight.create(0, 1, 1, 'n');
    $scope.livePieces[2] = $scope.board[0][2].piece = bishop.create(0, 2, 1, 'b');
    $scope.livePieces[0] = $scope.board[0][3].piece = king.create(0, 3, 1, 'k');
    $scope.livePieces[3] = $scope.board[0][4].piece = queen.create(0, 4, 1, 'q');
    $scope.livePieces[5] = $scope.board[0][5].piece = bishop.create(0, 5, 1, 'b');
    $scope.livePieces[6] = $scope.board[0][6].piece = knight.create(0, 6, 1, 'n');
    $scope.livePieces[7] = $scope.board[0][7].piece = rook.create(0, 7, 1, 'r');

    for (var i = 0; i < 8; i++)
        $scope.livePieces[8 + i] = $scope.board[1][i].piece = pawn.create(1, i, 1, 'p');

    for (var i = 0; i < 8; i++)
        $scope.livePieces[16 + i] = $scope.board[6][i].piece = pawn.create(6, i, -1, 'p');

    $scope.livePieces[24] = $scope.board[7][0].piece = rook.create(7, 0, -1, 'r');
    $scope.livePieces[25] = $scope.board[7][1].piece = knight.create(7, 1, -1, 'n');
    $scope.livePieces[26] = $scope.board[7][2].piece = bishop.create(7, 2, -1, 'b');
    $scope.livePieces[1] = $scope.board[7][3].piece = king.create(7, 3, -1, 'k');
    $scope.livePieces[27] = $scope.board[7][4].piece = queen.create(7, 4, -1, 'q');
    $scope.livePieces[29] = $scope.board[7][5].piece = bishop.create(7, 5, -1, 'b');
    $scope.livePieces[30] = $scope.board[7][6].piece = knight.create(7, 6, -1, 'n');
    $scope.livePieces[31] = $scope.board[7][7].piece = rook.create(7, 7, -1, 'r');

    if (gameData.againstStockfish && gameData.side === -1) {
        var positionString = translatorService.convertToFEN($scope.board, $scope.data.side, $scope.livePieces[0], $scope.livePieces[1], $scope.data.enPassant, $scope.data.halfMoves, $scope.data.fullMoves);

        socketService.socket.emit("move-made", {
            "source": socketService.socket.id,
            "againstStockfish": gameData.againstStockfish,
            "positionString": positionString,
            "searchString": "go 1000"
        });
    }

    socketService.socket.on("move-made", function (data) {

        if ($scope.data.side === 1)
            $scope.data.fullMoves++;

        $scope.data.halfMoves++;

        var king = $scope.livePieces[$scope.data.side === 1 ? 1 : 0];
        if ($scope.board[data.or][data.of].piece.type === 'k') {
            king.kingMoved = true;
        } else if ($scope.board[data.or][data.of].piece.type === 'r') {
            if ((data.or == 0 || data.or == 7) && data.of == 0)
                king.rookAMoved = true;
            if ((data.or == 0 || data.or == 7) && data.of == 7)
                king.rookHMoved = true;
        }


        if ($scope.board[data.or][data.of].piece.type === 'k' && Math.abs(data.nf - data.of) > 1) {
            var nf, of, or, nr;
            nr = or = data.or;
            of = (data.nf < 3) ? 0 : 7;
            nf = (data.nf < 3) ? 2 : 4;
            $scope.board[nr][nf].piece = $scope.board[or][of].piece;
            $scope.board[or][of].piece = undefined;
            $scope.board[nr][nf].piece.rank = or;
            $scope.board[nr][nf].piece.file = of;
        }

        if ($scope.board[data.or][data.of].piece.type === 'p')
            $scope.data.halfMoves = 0;

        var capturingEnPassant = false;

        if ($scope.data.enPassant && $scope.board[data.or][data.of].piece.type === 'p' && data.nr === $scope.data.enPassant.rank && data.nf === $scope.data.enPassant.file)
            capturingEnPassant = true;


        if ($scope.board[data.or][data.of].piece.type === 'p' && Math.abs(data.nr - data.or) > 1) {
            $scope.data.enPassant = {
                "rank": data.nr - $scope.board[data.or][data.of].piece.side,
                "file": data.nf
            };
        } else
            $scope.data.enPassant = undefined;

        if (!$scope.board[data.nr][data.nf].piece && !capturingEnPassant) {

            $scope.board[data.nr][data.nf].piece = $scope.board[data.or][data.of].piece;
            $scope.board[data.or][data.of].piece = undefined;
            $scope.board[data.nr][data.nf].piece.rank = data.nr;
            $scope.board[data.nr][data.nf].piece.file = data.nf;
        } else {

            $scope.data.halfMoves = 0;

            if (capturingEnPassant)
                data.nr = data.nr - $scope.board[data.or][data.of].piece.side;

            $scope.capturedPieces.push($scope.board[data.nr][data.nf].piece);
            $scope.livePieces.splice($scope.livePieces.indexOf($scope.board[data.nr][data.nf].piece), 1);
            $scope.board[data.nr][data.nf].piece = undefined;

            if (capturingEnPassant)
                data.nr = data.nr + $scope.board[data.or][data.of].piece.side;

            $scope.board[data.nr][data.nf].piece = $scope.board[data.or][data.of].piece;
            $scope.board[data.or][data.of].piece = undefined;
            $scope.board[data.nr][data.nf].piece.rank = data.nr;
            $scope.board[data.nr][data.nf].piece.file = data.nf;
        }

        if (data.promoteTo)
            $scope.promotePawn(data.nr, data.nf, data.promoteTo);

        if (!threatMapService.hasMoves($scope.data.side, $scope.livePieces, $scope.board, $scope.data.enPassant)) {
            var king = $scope.livePieces[$scope.data.side === 1 ? 0 : 1];
            if ($scope.board[king.rank][king.file].threats($scope.board, -$scope.data.side).count > 0)
                $scope.data.winner = -$scope.data.side;
            else
                $scope.data.winner = 0;
            $scope.data.ended = true;
            $scope.endGame($scope.data.winner);
        } else {
            $scope.data.turn = true;
        }
        $scope.$apply();
    });

    $scope.promotePawn = function (rank, file, type) {
        var pieceSide = rank === 0 ? -1 : 1;
        var promoted;
        if (type === 'q')
            promoted = queen.create(rank, file, pieceSide, type);
        else if (type === 'r')
            promoted = rook.create(rank, file, pieceSide, type);
        else if (type === 'b')
            promoted = bishop.create(rank, file, pieceSide, type);
        else if (type === 'n')
            promoted = knight.create(rank, file, pieceSide, type);

        $scope.livePieces[$scope.livePieces.indexOf($scope.board[rank][file])] = promoted;
        $scope.board[rank][file].piece = promoted;
    };

    $scope.endGame = function (side) {
        var modal = $uibModal.open({
            animation: true,
            templateUrl: "/static/templates/GameOver.html",
            controller: "resultController",
            resolve: {
                winner: function () {
                    return side;
                }
            }
        });
    }

    $scope.selectSquare = function (r, f) {

        if (!$scope.data.turn)
            return;

        if (!$scope.data.picked) {
            if ($scope.board[r][f].piece) {
                if ($scope.board[r][f].piece.side != $scope.data.side)
                    return;
                $scope.data.picked = {
                    "r": r,
                    "f": f
                };
                $scope.data.lists = threatMapService.refineLegalMoves($scope.board, $scope.board[r][f].piece.legalMoves($scope.board, $scope.data.enPassant), r, f, $scope.board[r][f].piece.side, $scope.board[r][f].piece.type, $scope.livePieces[$scope.board[r][f].piece.side === 1 ? 0 : 1]);

                for (var x in $scope.data.lists.move)
                    $scope.board[$scope.data.lists.move[x].rank][$scope.data.lists.move[x].file].highlightedMove = true;
                for (var x in $scope.data.lists.castle)
                    $scope.board[$scope.data.lists.castle[x].rank][$scope.data.lists.castle[x].file].highlightedMove = true;
                for (var x in $scope.data.lists.capture)
                    $scope.board[$scope.data.lists.capture[x].rank][$scope.data.lists.capture[x].file].highlightedCapture = true;
                if ($scope.data.lists.enPassantCapture)
                    $scope.board[$scope.data.lists.enPassantCapture.rank][$scope.data.lists.enPassantCapture.file].highlightedCapture = true;
            }

        } else {

            if ($scope.board[r][f].highlightedMove || $scope.board[r][f].highlightedCapture) {

                $scope.data.halfMoves++;
                if ($scope.data.side === -1)
                    $scope.data.fullMoves++;
                var king = $scope.livePieces[$scope.data.side === 1 ? 0 : 1];
                if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'k') {
                    king.kingMoved = true;
                } else if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'r') {
                    if ((r == 0 || r == 7) && f == 0)
                        king.rookAMoved = true;
                    if ((r == 0 || r == 7) && f == 7)
                        king.rookHMoved = true;
                }
                $scope.data.turn = false;
            }

            if ($scope.board[r][f].highlightedMove) {

                if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'p')
                    $scope.data.halfMoves = 0;

                if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'k' && Math.abs(f - $scope.data.picked.f) > 1) {
                    var nf, of, or, nr;
                    nr = or = r;
                    of = (f < 3) ? 0 : 7;
                    nf = (f < 3) ? 2 : 4;
                    $scope.board[nr][nf].piece = $scope.board[or][of].piece;
                    $scope.board[or][of].piece = undefined;
                    $scope.board[nr][nf].piece.rank = or;
                    $scope.board[nr][nf].piece.file = of;
                }

                $scope.board[r][f].piece = $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece;
                $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece = undefined;
                $scope.board[r][f].piece.rank = r;
                $scope.board[r][f].piece.file = f;

            } else if ($scope.board[r][f].highlightedCapture) {

                $scope.data.halfMoves = 0;

                var capturingEnPassant = false;

                if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'p' && $scope.data.enPassant && r === $scope.data.enPassant.rank && f === $scope.data.enPassant.file)
                    capturingEnPassant = true;

                if (capturingEnPassant)
                    r = r - $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.side;
                $scope.capturedPieces.push($scope.board[r][f].piece);
                $scope.livePieces.splice($scope.livePieces.indexOf($scope.board[r][f].piece), 1);
                $scope.board[r][f].piece = undefined;

                if (capturingEnPassant)
                    r = r + $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.side;

                $scope.board[r][f].piece = $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece;
                $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece = undefined;
                $scope.board[r][f].piece.rank = r;
                $scope.board[r][f].piece.file = f;

            }
            if ($scope.board[r][f].highlightedMove || $scope.board[r][f].highlightedCapture) {

                var or = $scope.data.picked.r,
                    of = $scope.data.picked.f,
                    nr = r,
                    nf = f;

                if ($scope.board[nr][nf].piece.type === 'p' && Math.abs(nr - or) > 1) {
                    $scope.data.enPassant = {
                        "rank": nr - $scope.board[nr][nf].piece.side,
                        "file": nf
                    };
                } else
                    $scope.data.enPassant = undefined;

                if ($scope.board[nr][nf].piece.type === 'p' && (nr === 0 || nr === 7)) {
                    $scope.selection = {};
                    var modal = $uibModal.open({
                        animation: true,
                        templateUrl: "/static/templates/promotion.html",
                        controller: "promotionController",
                        resolve: {
                            data: function () {
                                return $scope.data;
                            },
                            selection: function () {
                                return $scope.selection;
                            }
                        }
                    });

                    modal.result.then(function () {
                        console.log("succes callback - never used");
                    }, function () {
                        var promotionType = $scope.selection.value;
                        $scope.promotePawn(nr, nf, promotionType);
                        if (gameData.againstStockfish)
                            var positionString = translatorService.convertToFEN($scope.board, $scope.data.side, $scope.livePieces[0], $scope.livePieces[1], $scope.data.enPassant, $scope.data.halfMoves, $scope.data.fullMoves);
                        socketService.socket.emit("move-made", {
                            "or": or,
                            "of": of,
                            "nr": nr,
                            "nf": nf,
                            "source": socketService.socket.id,
                            "promoteTo": promotionType,
                            "againstStockfish": gameData.againstStockfish,
                            "positionString": positionString,
                            "searchString": "go 1000"
                        });
                    });
                } else {
                    if (gameData.againstStockfish)
                        var positionString = translatorService.convertToFEN($scope.board, $scope.data.side, $scope.livePieces[0], $scope.livePieces[1], $scope.data.enPassant, $scope.data.halfMoves, $scope.data.fullMoves);

                    socketService.socket.emit("move-made", {
                        "or": or,
                        "of": of,
                        "nr": nr,
                        "nf": nf,
                        "source": socketService.socket.id,
                        "againstStockfish": gameData.againstStockfish,
                        "positionString": positionString,
                        "searchString": "go 1000"
                    });

                }
            }

            if ($scope.data.lists) {
                for (var x in $scope.data.lists.move)
                    $scope.board[$scope.data.lists.move[x].rank][$scope.data.lists.move[x].file].highlightedMove = false;
                for (var x in $scope.data.lists.castle)
                    $scope.board[$scope.data.lists.castle[x].rank][$scope.data.lists.castle[x].file].highlightedMove = false;
                for (var x in $scope.data.lists.capture)
                    $scope.board[$scope.data.lists.capture[x].rank][$scope.data.lists.capture[x].file].highlightedCapture = false;
                if ($scope.data.lists.enPassantCapture)
                    $scope.board[$scope.data.lists.enPassantCapture.rank][$scope.data.lists.enPassantCapture.file].highlightedCapture = false;
            }
            $scope.data.picked = false;

            if (!threatMapService.hasMoves(-$scope.data.side, $scope.livePieces, $scope.board, $scope.data.enPassant)) {
                var king = $scope.livePieces[$scope.data.side === -1 ? 0 : 1];
                if ($scope.board[king.rank][king.file].threats($scope.board, $scope.data.side).count > 0)
                    $scope.data.winner = $scope.data.side;
                else
                    $scope.data.winner = 0;
                $scope.endGame($scope.data.winner);
                $scope.data.ended = true;
            }
        }
    };
}]);
