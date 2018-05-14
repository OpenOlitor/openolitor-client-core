'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('EmailDialogController', ['$scope', '$filter',
    'msgBus', 'lodash', 'MailerService',
    function($scope, $filter, msgBus, _, MailerService) {

      $scope.batchCreated = {
        ids: [],
        openIds: $scope.ids,
      };

      $scope.commandIssued = false;

      $scope.templateT = [];
      MailerService.getTemplates().then(function(result){
          var i = 0;
          angular.forEach(result.data, function(value,key){
              if (value.templateType === 'CustomMailTemplateType' ){
                $scope.templateT.push(value);
              }
          });
      },function(result){ });

      $scope.selectedMailTemplate = {
        subject: undefined,
        body: undefined,
        attachInvoice: false
      }

      $scope.open = {
        start: false
      };

      $scope.batchCreate = function() {
        if ($scope.ids){
            $scope.selectedMailTemplate.ids = $scope.ids;
            MailerService.sendEMail($scope.selectedMailTemplate,$scope.url).then(function() {
                $scope.commandIssued = true;
                $scope.createHasWorked = true;
            }, function (){
                $scope.commandIssued = true;
                $scope.createHasWorked = false;
            });
        }
      };

      $scope.selectTemplateFunc = function() {
        var selectTemplate = function(template) {
          $scope.selectedMailTemplate.subject = template.subject;
          $scope.selectedMailTemplate.body = template.body;
          return true; //reset dropdown
        };
        return selectTemplate;
      };

      msgBus.onMsg('MailSend', $scope, function(event, msg) {
        if(_.includes($scope.selectedMailTemplate.ids, msg.data.aboId)) {
          $scope.batchCreated.ids.push(msg.data.id);
          _.pull($scope.batchCreated.openIds, msg.data.aboId);
          $scope.$apply();
        }
      });
    }
  ]);
