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
        $element.parent().parent().parent().scope().params.settings().exportODSModel.exportODS({
          q: $element.parent().parent().parent().scope().query
        }, function(file) {
          FileSaver.saveAs(file.response, fileName + '.ods');
        });
      };

    }
  ]
);
