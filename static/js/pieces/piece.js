angular.module("pieceDefinitions", [])

.factory("piece", function () {

    var constructor = function (rank, file, side, type, legalMoves) {
        var o = {};
        o.rank = rank;
        o.file = file;
        o.side = side;
        o.type = type;
        o.legalMoves = legalMoves;
        return o;
    };

    return {
        "create": constructor
    }
});
