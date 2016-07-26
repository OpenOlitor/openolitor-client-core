'use strict';

angular.module('openolitor-core').controller('ooDialogOkAbortModalInstanceCtrl', function ($scope, $uibModalInstance, message) {

  $scope.message = message;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
