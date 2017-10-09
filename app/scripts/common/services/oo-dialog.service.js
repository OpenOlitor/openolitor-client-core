  'use strict';

  angular.module('openolitor-core').factory('dialogService', ['$uibModal', function($uibModal) {

    return {
      displayDialogOkAbort: function(msg, okFct, title, dismissOnly, dismissButtonTitle) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/common/components/oo-dialogokabort.directive.modal.html',
          controller: 'ooDialogOkAbortModalInstanceCtrl',
          resolve: {
            message: function() {
              return msg;
            },

            title: function() {
              return title;
            },

            dismissOnly: function() {
              return dismissOnly;
            },

            dismissButtonTitle: function() {
              return dismissButtonTitle;
            }
          }
        });

        modalInstance.result.then(okFct);
      }

    };
  }]);
