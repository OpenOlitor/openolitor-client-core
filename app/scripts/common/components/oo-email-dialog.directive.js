'use strict';

angular.module('openolitor-core').directive('ooEmailDialog', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ids: '=',
        message: '=',
        entity: '=',
        url: '=',
        attachment: '=',
        dialog: '=',
        onClose: '&'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-email-dialog.html',
      controller: 'EmailDialogController',
      link: function($scope,$elem,$attrs){
         $scope.$on('resetDirectiveEmailDialog',function (event) {
           var form = document.querySelector('[name=emailForm]');
           $scope.resetDropdown();
           form.reset();
         });
      }
    }
  }
]);
