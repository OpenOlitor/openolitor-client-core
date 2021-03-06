'use strict';

angular.module('openolitor-core').directive('ooDeleteButton', ['msgBus', 'gettext',
  'alertService', '$uibModal',
  function(msgBus, gettext, alertService, $uibModal) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        onDelete: '=',
        form: '=',
        onDeleted: '=',
        confirm: '@?',
        confirmMessage: '@?',
        condensed: '@?',
        notext: '@?',
        small: '@?',
        buttonClass: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-deletebutton.directive.html',
      controller: function($scope) {

        if(!angular.isUndefined($scope.condensed) && $scope.condensed) {
          $scope.notext = true;
          $scope.small = true;
        }

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };
        msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'deleting') {
              alertService.addAlert('info', gettext($scope.entity +
                ' wurde durch eine andere Person gelöscht.'));
            } else {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('info', gettext($scope.entity +
                ' wurde erfolgreich gelöscht.'));
              $scope.$apply();
            }
            //redirect to main page
            if(angular.isDefined($scope.onDeleted)) {
              $scope.onDeleted(msg.data.id);
            }
          }
        });

        $scope.getButtonTypeClass = function() {
          if(angular.isUndefined($scope.buttonClass)) {
            return 'btn-danger';
          } else {
            return $scope.buttonClass;
          }
        };

        $scope.modalDialog = function(executeOnOK) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/common/components/oo-deletebutton.directive.modal.html',
            controller: 'ooDeleteButtonModalInstanceCtrl',
            resolve: {
              message: function() {
                return $scope.confirmMessage;
              }
            }
          });

          modalInstance.result.then(function () {
            executeOnOK();
          });
        };

        $scope.delete = function() {
          if(angular.isDefined($scope.confirm) && $scope.confirm) {
            $scope.modalDialog($scope.deleteAction);
          } else {
            $scope.deleteAction();
          }
        };

        $scope.deleteAction = function() {
          if ($scope.form) {
            if ($scope.form.destroyConfirmOnDirty &&
                typeof $scope.form.destroyConfirmOnDirty === 'function') {
              $scope.form.destroyConfirmOnDirty();
            }
          }
          $scope.model.actionInProgress = 'deleting';
          var ret = $scope.onDelete($scope.model);
          if(ret && !angular.isUndefined(ret.catch)) {
            ret.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('error', gettext($scope.entity +
                  ' konnte nicht gelöscht werden. Fehler: ') +
                req.status +
                '-' + req.statusText + ':' + req.data
              );
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };
      }
    };
  }
]);

angular.module('openolitor-core').controller('ooDeleteButtonModalInstanceCtrl', function ($scope, $uibModalInstance, message) {

  $scope.getMessage = function() {
    return message;
  };

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
