'use strict';

/**
*/
angular.module('openolitor-core')
    .controller('EmailConfirmationMessageController', ['$scope', '$uibModalInstance', 'number','entity', 'MailerService', 'ids', 'selectedMailTemplate','url',
        function($scope, $uibModalInstance, number, entity, MailerService, ids, selectedMailTemplate,url) {
            $scope.emailNumber = number;
            $scope.entity = entity;
            $scope.sendClicked = false;

            $scope.batchCreate = function() {
                if (ids){
                    $scope.sendClicked = true;
                    selectedMailTemplate.ids = ids;
                    MailerService.sendEMail(selectedMailTemplate,url).then(function() {
                      $uibModalInstance.close('Mailversand ausgelöst');
                    }, function (e) {
                      $uibModalInstance.close('Mailversand fehlerhaft: ' + e);
                    });
                }
            };

            $scope.ok = function() {
              $scope.batchCreate();
            };

            $scope.cancel = function() {
              $uibModalInstance.dismiss('Cancel');
            };
        }
    ]);
