'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('EmailDialogController', ['$scope', '$filter',
    'msgBus', 'lodash', 'MailerService','$uibModal', 'gettext',
    function($scope, $filter, msgBus, _, MailerService, $uibModal, gettext) {

      $scope.batchCreated = {
        ids: [],
        openIds: $scope.ids,
      };

      $scope.sendResult = {
        status: false,
        message: undefined
      };

      $scope.commandIssued = false;

      $scope.defaultEmptyTemplate = {id:0,label:gettext('Keine Vorlage'),subject:undefined,body:undefined,attachInvoice:false};
      $scope.templateT = [$scope.defaultEmptyTemplate];
      MailerService.getTemplates().then(function(result){
          angular.forEach(result.data, function(value){
              if (value.templateType === 'CustomMailTemplateType' ){
                  value.label = value.subject;
                $scope.templateT.push(value);
              }
          });
      });

      $scope.selectedMailTemplate = {
        id: $scope.defaultEmptyTemplate.id ,
        subject: $scope.defaultEmptyTemplate.subject,
        body: $scope.defaultEmptyTemplate.body,
        label: $scope.defaultEmptyTemplate.label,
        attachInvoice: $scope.defaultEmptyTemplate.attachInvoice
      };

      $scope.open = {
        start: false
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
                  },
                  ids: function() {
                      return $scope.ids;
                  },
                  selectedMailTemplate: function() {
                      return $scope.selectedMailTemplate;
                  },
                  url:  function() {
                      return $scope.url;
                  }
              }
          });
          modalInstance.result.then(function (returnMessage) {
            $scope.sendResult.status = true;
            $scope.sendResult.message = returnMessage;
          }, function () {
            //dismissed
          });
      };

      $scope.onchange = function() {
          angular.forEach($scope.templateT, function(value){
            if (value.id === $scope.selectedId){
                $scope.selectedMailTemplate.subject = value.subject;
                $scope.selectedMailTemplate.body = value.body;
                $scope.selectedMailTemplate.label = value.label;
                $scope.selectedMailTemplate.id = value.id;
            }
          });
      };

      $scope.resetDropdown = function(){
              $scope.$broadcast('resetDropdown', $scope.defaultEmptyTemplate.id);
      };

      $scope.selectTemplateFunc = function() {
        var selectTemplate = function(template) {
          $scope.selectedMailTemplate.subject = template.subject;
          $scope.selectedMailTemplate.body = template.body;
          $scope.selectedMailTemplate.label = template.label;
          $scope.selectedId = template.id;
          return false;
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
