angular.module("chess", ["ui.router", "ui.bootstrap"])

.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/list");


    $stateProvider.state("list", {
        url: "/list",
        templateUrl: "/static/templates/list.html"
    })

    .state("game", {
        url: "/game",
        templateUrl: "/static/templates/game.html"
    })
}])

.service("socketService", function () {
    this.socket = io();
})

.service("gameData", function () {
    this.started = false;
    this.opponent = undefined;
    this.player = undefined;
    this.side = undefined;
    this.turn = false;
    this.picked = false;
    this.enPassant = undefined;
})

.controller("GameController", ['$scope', 'gameData', 'socketService', '$uibModal', function ($scope, gameData, socketService, $uibModal) {
    $scope.board = [];
    for (var i = 0; i < 8; i++) {
        $scope.board.push([]);
        for (var j = 0; j < 8; j++)
            $scope.board[i].push({
                'rank': i,
                'file': j,
                'threats': threats
            });
    }

    $scope.data = gameData;

    $scope.livePieces = new Array(32);
    $scope.capturedPieces = [];

    $scope.livePieces[4] = $scope.board[0][0].piece = new rook(0, 0, 1, 'r');
    $scope.livePieces[28] = $scope.board[0][1].piece = new knight(0, 1, 1, 'n');
    $scope.livePieces[2] = $scope.board[0][2].piece = new bishop(0, 2, 1, 'b');
    $scope.livePieces[0] = $scope.board[0][3].piece = new king(0, 3, 1, 'k');
    $scope.livePieces[3] = $scope.board[0][4].piece = new queen(0, 4, 1, 'q');
    $scope.livePieces[5] = $scope.board[0][5].piece = new bishop(0, 5, 1, 'b');
    $scope.livePieces[6] = $scope.board[0][6].piece = new knight(0, 6, 1, 'n');
    $scope.livePieces[7] = $scope.board[0][7].piece = new rook(0, 7, 1, 'r');

    for (var i = 0; i < 8; i++)
        $scope.livePieces[8 + i] = $scope.board[1][i].piece = new pawn(1, i, 1, 'p');

    for (var i = 0; i < 8; i++)
        $scope.livePieces[16 + i] = $scope.board[6][i].piece = new pawn(6, i, -1, 'p');

    $scope.livePieces[24] = $scope.board[7][0].piece = new rook(7, 0, -1, 'r');
    $scope.livePieces[25] = $scope.board[7][1].piece = new knight(7, 1, -1, 'n');
    $scope.livePieces[26] = $scope.board[7][2].piece = new bishop(7, 2, -1, 'b');
    $scope.livePieces[1] = $scope.board[7][3].piece = new king(7, 3, -1, 'k');
    $scope.livePieces[27] = $scope.board[7][4].piece = new queen(7, 4, -1, 'q');
    $scope.livePieces[29] = $scope.board[7][5].piece = new bishop(7, 5, -1, 'b');
    $scope.livePieces[30] = $scope.board[7][6].piece = new knight(7, 6, -1, 'n');
    $scope.livePieces[31] = $scope.board[7][7].piece = new rook(7, 7, -1, 'r');

    socketService.socket.on("move-made", function (data) {
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

        if (!hasMoves($scope.data.side, $scope.livePieces, $scope.board, $scope.data.enPassant)) {
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
            promoted = new queen(rank, file, pieceSide, type);
        else if (type === 'r')
            promoted = new rook(rank, file, pieceSide, type);
        else if (type === 'b')
            promoted = new bishop(rank, file, pieceSide, type);
        else if (type === 'n')
            promoted = new knight(rank, file, pieceSide, type);

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
                $scope.data.lists = refineLegalMoves($scope.board, $scope.board[r][f].piece.legalMoves($scope.board, $scope.data.enPassant), r, f, $scope.board[r][f].piece.side, $scope.board[r][f].piece.type, $scope.livePieces[$scope.board[r][f].piece.side === 1 ? 0 : 1]);

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

                if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'k') {
                    $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.kingMoved = true;
                } else if ($scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.type === 'r') {
                    var side = $scope.board[$scope.data.picked.r][$scope.data.picked.f].piece.side === 1 ? 0 : 1;
                    if ((r == 0 || r == 7) && f == 0)
                        $scope.livePieces[side].rookAMoved = true;
                    if ((r == 0 || r == 7) && f == 7)
                        $scope.livePieces[side].rookHMoved = true;
                }
                $scope.data.turn = false;
            }

            if ($scope.board[r][f].highlightedMove) {
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
                        socketService.socket.emit("move-made", {
                            "or": or,
                            "of": of,
                            "nr": nr,
                            "nf": nf,
                            "source": socketService.socket.id,
                            "promoteTo": promotionType
                        });
                    });
                } else
                    socketService.socket.emit("move-made", {
                        "or": or,
                        "of": of,
                        "nr": nr,
                        "nf": nf,
                        "source": socketService.socket.id
                    });
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

            if (!hasMoves(-$scope.data.side, $scope.livePieces, $scope.board, $scope.data.enPassant)) {
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
}])

.controller("listController", ['$scope', 'socketService', 'gameData', '$state', function ($scope, socketService, gameData, $state) {

    $scope.list = [];

    $scope.userName = "";

    $scope.failed = false;

    socketService.socket.on("connect", function () {
        $scope.id = socketService.socket.id;
        $scope.$apply();
    });

    socketService.socket.emit("get-list");

    socketService.socket.on("add-games", function (data) {
        $scope.list = $scope.list.concat(data);
        $scope.$apply();
    });

    socketService.socket.on("update-list", function (data) {
        $scope.list[data.index] = data.game;
        $scope.$apply();
    });

    socketService.socket.on("remove-from-list", function (data) {
        $scope.list.splice(data.index, 1);
        $scope.$apply();
    });

    socketService.socket.on("game-created", function (data) {
        gameData.started = true;

        if (data) {
            gameData.opponent = data.player;

            gameData.player = $scope.userName === "" ? "Anonymous" : $scope.userName;

            gameData.side = -data.side;

            gameData.turn = !data.turn;
        }

        $state.go("game");
    });

    $scope.createGame = function () {
        if ($scope.userName && $scope.userName != "") {
            $scope.failed = false;
            socketService.socket.emit("new-game", {
                'player': $scope.userName,
                'side': ((Math.random() > 0.5) ? 'black' : 'white'),
                'id': socketService.socket.id
            });
        } else {
            $scope.failed = true;
        }
    }

    $scope.joinGame = function (id, opponent, side) {

        gameData.opponent = opponent;

        gameData.player = $scope.userName === "" ? "Anonymous" : $scope.userName;

        gameData.side = (side === "white") ? 1 : -1;

        gameData.turn = (side === "white") ? true : false;

        gameData.started = true;

        socketService.socket.emit("join-game", {
            'owner': id,
            'opponent': socketService.socket.id,
            'gameData': gameData
        });
    }
}])

.controller('promotionController', ['$scope', '$uibModalInstance', 'data', 'selection', function ($scope, $uibModalInstance, data, selection) {
    selection.value = 'q';
    $scope.side = data.side;
    $scope.pieces = ['n', 'b', 'r', 'q'];
    $scope.select = function (i) {
        selection.value = $scope.pieces[i];
        $uibModalInstance.dismiss();
    }
}])

.controller('resultController', ['$scope', 'winner', function ($scope, winner) {
    $scope.winner = winner;
}]);
