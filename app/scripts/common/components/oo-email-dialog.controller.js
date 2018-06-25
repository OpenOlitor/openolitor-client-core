'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('EmailDialogController', ['$scope', '$filter',
    'msgBus', 'lodash', 'MailerService','$uibModal',
    function($scope, $filter, msgBus, _, MailerService, $uibModal) {

      $scope.batchCreated = {
        ids: [],
        openIds: $scope.ids,
      };

      $scope.commandIssued = false;
        
      $scope.defaultEmptyTemplate = {id:0,label:gettext('no template'),subject:undefined,body:undefined,attachInvoice:false};
      $scope.templateT = [$scope.defaultEmptyTemplate];
      MailerService.getTemplates().then(function(result){
          var i = 0;
          angular.forEach(result.data, function(value,key){
              if (value.templateType === 'CustomMailTemplateType' ){
                  value.label = value.subject;
                $scope.templateT.push(value);
              }
          });
      },function(result){ });
        
      $scope.selectedMailTemplate = {
        id: $scope.defaultEmptyTemplate.id ,
        subject: $scope.defaultEmptyTemplate.subject,
        body: $scope.defaultEmptyTemplate.body,
        label: $scope.defaultEmptyTemplate.label,
        attachInvoice: $scope.defaultEmptyTemplate.id
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

      $scope.showEmailConfirmationDialog = function(){
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'scripts/common/components/oo-email-confirmation-message.html',
              controller: 'EmailConfirmationMessageController', 
              resolve: {
                  number: function() {
                      return $scope.ids.length;
                  },
                  entity: function() {
                      return $scope.entity;
                  }
              }
          });
          modalInstance.result.then(function(data) {
          }, function() {
          });       
      }

      $scope.onchange = function() {
          angular.forEach($scope.templateT, function(value,key){
            if (value.id === $scope.selectedId){
                $scope.selectedMailTemplate.subject = value.subject;
                $scope.selectedMailTemplate.body = value.body;
                $scope.selectedMailTemplate.label = value.label;
                $scope.selectedMailTemplate.id = value.id;
            }
          });
      }

      $scope.resetDropdown = function(reset){
              $scope.$broadcast("resetDropdown", $scope.defaultEmptyTemplate.id);
      }

      $scope.selectTemplateFunc = function(reset) {
        var selectTemplate = function(template) {
          $scope.selectedMailTemplate.subject = template.subject;
          $scope.selectedMailTemplate.body = template.body;
          $scope.selectedMailTemplate.label = template.label;
          $scope.selectedId = template.id;
          return false; 
        }
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
