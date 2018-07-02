'use strict';

/**
*/
angular.module('openolitor-core')
    .controller('EmailConfirmationMessageController', ['$scope', '$uibModalInstance', 'number','entity', 'MailerService', 'ids', 'selectedMailTemplate','url', 
        function($scope, $uibModalInstance, number, entity, MailerService, ids, selectedMailTemplate,url) {
            $scope.emailNumber = number;
            $scope.entity = entity;

            $scope.batchCreate = function() {
                if (ids){
                    selectedMailTemplate.ids = ids;
                    MailerService.sendEMail(selectedMailTemplate,url).then(function() {
                    }, function (){
                    });
                }
            };

            $scope.ok = function() {
                $uibModalInstance.close('All emails sent');
                $scope.batchCreate();
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('Cancel');
            };
        }
    ]);

