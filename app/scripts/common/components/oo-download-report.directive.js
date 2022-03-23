'use strict';

angular.module('openolitor-core').directive('ooDownloadReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      postPath: '=',
      onDownloaded: '&',
      onClose: '&',
      defaultFileName: '=',
      ids: '=?',
      form: '=?'
    },
    templateUrl: 'scripts/common/components/oo-download-report.directive.html',
    controller: function(
      $scope,
      $http,
      appConfig,
      FileUtil,
      gettext,
      lodash,
      alertService,
      PDF_DOWNLOAD_TYPES,
      EnumUtil
    ) {
      $scope.pdfDownloadTypes = EnumUtil.asArray(PDF_DOWNLOAD_TYPES); 

      $scope.form = {
        pdfMerge: 'pdfMerge'
      };

      $scope.download = function() {
        $scope.error = undefined;
        FileUtil.downloadPost($scope.postPath,{
          'ids': $scope.ids,
          'pdfMerge': $scope.form.pdfMerge
        });
      };
    },

    link: function($scope, $elem, $attrs) {
      $scope.$on('resetDirectiveDownloadReport', function(event) {
        var form = document.querySelector('[name=downloadForm]');
        $scope.form = {
          pdfMerge: $scope.form.pdfMerge
        };
      });
    }
  };
});
