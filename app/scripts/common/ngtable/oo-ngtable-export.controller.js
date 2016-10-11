'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('NgTableExportController', ['$scope', '$element', 'exportTable', 'FileSaver',
    function($scope, $element, exportTable, FileSaver) {
      $scope.showExport = false;
      var fileName = 'Export';
      if(angular.isDefined($element.parent().parent().parent().parent())) {
        fileName = $element.parent().parent().parent().parent().attr('export-file-name');
        $scope.showExport = $element.parent().parent().parent().parent().attr('display-export');
      }
      $scope.exportData = function() {
        var filter = { };
        if(angular.isDefined($element.parent().parent().parent().scope().params.settings().exportODSFilter)) {
          filter = $element.parent().parent().parent().scope().params.settings().exportODSFilter();
        }
        $element.parent().parent().parent().scope().params.settings().exportODSModel.exportODS(
          filter,
          function(file) {
            FileSaver.saveAs(file.response, fileName + '.ods');
          }
        );
      };

    }
  ]
);
