angular.module("chess")

.controller('ChatController', ['$scope', 'socketService', function ($scope, socketService) {
    $scope.message = '';
    $scope.messages = [];
    
    $scope.send = function() {
        $scope.message = $scope.message.trim();
        if(!$scope.message) return;

        socketService.emit("message", {
            "source": socketService.socket.id,
            "side": $scope.data.side,
            "text": $scope.message
        });
        $scope.messages.push({
            "side": $scope.data.side,
            "text": $scope.message
        });
        $scope.message = '';
    }

    socketService.on("message", function (data) {
        $scope.messages.push({
            "side": data.side,
            "text": data.text
        });
    });
}]);
