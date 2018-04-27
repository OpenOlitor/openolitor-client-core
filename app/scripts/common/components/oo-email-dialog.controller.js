'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('EmailDialogController', ['$scope', '$filter',
    'msgBus', 'lodash', 'MailerService',
    function($scope, $filter, msgBus, _, MailerService) {

      $scope.kundeInfoText = 'Labels allowed to be replaced: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{kunde.bezeichnung}} \n {{kunde.strasse}}  \n {{kunde.hausNummer}}  \n {{kunde.plz}}  \n {{kunde.ort}}';
      $scope.personInfoText = 'Labels allowed to be replaced: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}}';
      $scope.aboInfoText = 'Labels allowed to be replaced: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{abo.abotypName}} \n {{abo.kunde}} \n {{abo.start}}  \n {{abo.ende}}';
      $scope.batchCreated = {
        ids: [],
        openKundeIds: $scope.kundeIds,
        openPersonIds: $scope.personIds,
        openAboIds: $scope.aboIds
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
        body: undefined
      }

      $scope.open = {
        start: false
      };

      $scope.batchCreate = function() {
        if ($scope.kundeIds){
            $scope.selectedMailTemplate.ids = $scope.kundeIds;
            MailerService.sendEMailToKunden($scope.selectedMailTemplate).then(function() {
                $scope.commandIssued = true;
                $scope.createHasWorked = true;
            }, function (){
                $scope.commandIssued = true;
                $scope.createHasWorked = false;
            });
        } else if ($scope.personIds){
            $scope.selectedMailTemplate.ids = $scope.personIds;
            MailerService.sendEMailToPersonen($scope.selectedMailTemplate).then(function() {
                $scope.commandIssued = true;
                $scope.createHasWorked = true;
            }, function (){
                $scope.commandIssued = true;
                $scope.createHasWorked = false;
            });
        }
        else if ($scope.aboIds){
            $scope.selectedMailTemplate.ids = $scope.aboIds;
            MailerService.sendEMailToAbosSubscribers($scope.selectedMailTemplate).then(function() {
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
          _.pull($scope.batchCreated.openKundeIds, msg.data.aboId);
          $scope.$apply();
        }
      });
    }
  ]);
