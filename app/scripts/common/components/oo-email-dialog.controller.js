'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('EmailDialogController', ['$scope', '$filter',
    'msgBus', 'lodash', 'MailerService',

    function($scope, $filter, msgBus, _, MailerService) {

      $scope.batchCreated = {
        ids: [],
        openKundeIds: $scope.kundeIds
      };

      $scope.commandIssued = false;

      $scope.tempalteL = [];

      $scope.open = {
        start: false
      };

      $scope.batchCreate = function() {
        $scope.kundenToMailTo.ids = $scope.kundeIds;
        MailerService.sendEMailToKunden($scope.kundenToMailTo).then(function() {
          $scope.commandIssued = true;
          $scope.createHasWorked = true;
        }, function (){
          $scope.commandIssued = true;
          $scope.createHasWorked = false;
        });
      };

      $scope.selectTemplateFunc = function() {
        var selectTemplate = function(template) {
          $scope.kundenToMailTo.subject = template.subject;
          $scope.kundenToMailTo.body = template.body;
          return true; //reset dropdown
        };
        return selectTemplate;
      };

      msgBus.onMsg('MailSend', $scope, function(event, msg) {
        if(_.includes($scope.kundenToMailTo.ids, msg.data.aboId)) {
          $scope.batchCreated.ids.push(msg.data.id);
          _.pull($scope.batchCreated.openKundeIds, msg.data.aboId);
          $scope.$apply();
        }
      });
    }
  ]);
