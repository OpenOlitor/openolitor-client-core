'use strict';

/**
*/
angular.module('openolitor-core')
    .controller('EmailConfirmationMessageController', ['$scope', '$uibModalInstance', 'number','entity',
        function($scope, $uibModalInstance, number, entity) {
            $scope.emailNumber = number;
            $scope.entity = entity;
            $scope.ok = function() {
                $uibModalInstance.close('All emails sent');
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

