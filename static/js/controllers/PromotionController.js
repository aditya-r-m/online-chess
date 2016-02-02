angular.module("chess")

.controller('promotionController', ['$scope', '$uibModalInstance', 'data', 'selection', function ($scope, $uibModalInstance, data, selection) {
    selection.value = 'q';
    $scope.side = data.side;
    $scope.pieces = ['n', 'b', 'r', 'q'];
    $scope.select = function (i) {
        selection.value = $scope.pieces[i];
        $uibModalInstance.dismiss();
    }
}]);
