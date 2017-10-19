
'use strict';

angular.module('openolitor-core').directive('ooEmailDialog', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        kundeIds: '=',
        onClose: '&'
      },
      transclude: false,
      templateUrl: 'scripts/common/components/oo-email-dialog.html',
      controller: 'EmailDialogController'
    };
  }
]);
