
'use strict';

angular.module('openolitor-core').directive('ooEmailDialog', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ids: '=',
        message: '=',
        url: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/common/components/oo-email-dialog.html',
      controller: 'EmailDialogController'
    };
  }
]);
