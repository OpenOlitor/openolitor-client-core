'use strict';

/**
 * OO Actions Button Directive
 * @namespace Directives
 *
 * @description
 * This directive adds a split button dropdown for the given array of actions.
 *
 * @scope
 *
 * @param {string} entity The entity that will be used to match messages.
 * @param {Array.<Object>=} entities Multiple entities that will be used to match messages.
 * @param {Object} model The related angular resource.
 * @param {Array.<Object>} actions An array of actions of the form:
 *                         {
 *                           iconClass: string, // if left undefined, a save icon will be used
 *                           label: string, // either label or labelFunction has to be defined
 *                           labelFunction: function, // optional
 *                           noText: boolean, // optional
 *                           noEntityText: boolean, // optional
 *                           onExecute: function(model), // will be executed on click
 *                           isDisabled: function(model),
 *                           isHidden: function(model) // hide this action
 *                         }
 */
angular.module('openolitor-core').directive('ooActionsButton', ['msgBus', 'gettext',
  'alertService', 'DataUtil', 'dialogService',
  function(msgBus, gettext, alertService, DataUtil, dialogService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        actions: '=',
        form: '=',
        confirm: '@?',
        condensed: '@?',
        small: '@?',
        onCreated: '=',
        btnStyle: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-actionsbutton.directive.html',
      controller: function($scope) {

        if(angular.isUndefined($scope.btnStyle) || !$scope.btnStyle) {
          $scope.btnStyle = 'btn-primary';
        }

        if (!angular.isUndefined($scope.condensed) && $scope.condensed) {
          $scope.notext = true;
          $scope.small = true;
        }

        $scope.isNew = function() {
          return !$scope.model || $scope.model.id === undefined;
        };

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };

        msgBus.onMsg('EntityModified', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && !angular.isUndefined(
              $scope.model) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'updating') {
              if ($scope.entity) {
                alertService.addAlert('info', $scope.entity + gettext(
                  ' wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.'
                ));
              }
            } else {
              DataUtil.update(msg.data, $scope.model);
              $scope.model.actionInProgress = undefined;
              $scope.$apply();
            }
          }
        });

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if ($scope.model && entityMatches(msg.entity) && msg.data.id ===
            $scope.model.id) {
            DataUtil.update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            if ($scope.onCreated) {
              if ($scope.form) {
                if ($scope.form.destroyConfirmOnDirty) {
                  $scope.form.destroyConfirmOnDirty();
                }
              }
              $scope.onCreated(msg.data.id);
            }
            $scope.$apply();
          }
        });

        var errorMessage = function(action, entity, status, statusText, errorData) {
          var actionText = gettext(action.label || action.labelFunction());
          var errorText = gettext(errorData.message);
          var entityText = entity && gettext($scope.entity) + ': ';
          alertService.addAlert('error',
            entityText +
            gettext('Aktion') + ' "' +
            actionText + '" ' +
            gettext('konnte nicht ausgeführt werden. Fehler:') + ' ' +
            status + '-' + gettext(statusText) + ': ' +
            errorText
          );
        };

        $scope.execute = function(action) {
          if((!angular.isDefined(action.confirm) || action.confirm) &&
            (angular.isDefined($scope.confirm) && $scope.confirm)) {
            dialogService.displayDialogOkAbort(action.confirmMessage,
              function() {
                $scope.executeAction(action);
              });
            } else {
              $scope.executeAction(action);
            }
        };

        $scope.executeAction = function(action) {
          $scope.model.actionInProgress = 'updating';
          var result = action.onExecute($scope.model);
          if (result && result.catch) {
            result.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              errorMessage(action, $scope.entity, req.status, req.statusText, req.data);
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };
      }
    };
  }
]);
