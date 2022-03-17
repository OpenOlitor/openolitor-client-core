'use strict';

angular.module('openolitor-core').directive('ooGenerateReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      postPath: '=',
      onGenerated: '&',
      onClose: '&',
      defaultFileName: '=',
      ids: '=?',
      projektVorlagen: '=?',
      directDownload: '=?'
    },
    templateUrl: 'scripts/common/components/oo-generate-report.directive.html',
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
        vorlage: undefined,
        projektVorlageId: undefined,
        pdfGenerieren: true,
        pdfAblegen: false,
        pdfDownloaden: true,
        pdfMerge: 'pdfMerge',
        datenExtrakt: false
      };

      var generateWithFormData = function(formData) {
        $scope.error = undefined;
        $http
          .post(appConfig.get().API_URL + $scope.postPath, formData, {
            //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
            // but this is not true because when we are sending up files the request
            // needs to include a 'boundary' parameter which identifies the boundary
            // name between parts in this multi-part request and setting the Content-type
            // manually will not set this boundary parameter. For whatever reason,
            // setting the Content-type to 'false' will force the request to automatically
            // populate the headers properly including the boundary parameter.
            headers: {
              'Content-Type': undefined
            },
            // angular.identity prevents Angular to do anything on our data (like serializing it).
            transformRequest: angular.identity
            // responseType: 'arraybuffer'
          })
          .then(
            function(res) {
              // handle json result
              if (
                res.data.validationErrors &&
                res.data.validationErrors.length > 0
              ) {
                var distinctErrors = lodash.groupBy(
                  res.data.validationErrors,
                  'message'
                );
                var errors = Object.keys(distinctErrors);
                var details = lodash.map(errors, function(error) {
                  return error + '(' + distinctErrors[error].length + ')';
                });
                alertService.addAlert(
                  'warning',
                  gettext(
                    'Beim erstellen der Dokumente sind folgende Fehler aufgetreten'
                  ),
                  details
                );
              } else if (
                $scope.form.datenExtrakt ||
                (!angular.isUndefined($scope.directDownload) &&
                  $scope.directDownload)
              ) {
                // assume file download
                var name = res.headers('Content-Disposition');
                var json = JSON.stringify(res.data, null, '\t');
                FileUtil.open(name || $scope.defaultFileName, [json], {
                  type: 'application/json'
                });
              }
              $scope.generating = false;
              $scope.onGenerated()();
            },
            function(response) {
              console.log('Failed generating report', response);
              $scope.generating = false;
              $scope.error = gettext('Bericht konnte nicht erzeugt werden');
            }
          );
      };

      $scope.generate = function() {
        var fd = new FormData();
        //add dummy parameter to create correct multipart request on empty form data
        fd.append('report', true);
        for (var key in $scope.form) {
          if ($scope.form[key]) {
            fd.append(key, $scope.form[key]);
          }
        }
        if ($scope.ids && angular.isArray($scope.ids)) {
          fd.append('ids', $scope.ids.toString());
        }
        $scope.generating = true;
        generateWithFormData(fd);
      };

      $scope.selectDatenExtrakt = function() {
        $scope.form.vorlage = undefined;
        $scope.form.datenExtrakt = true;
        $scope.form.projektVorlageId = undefined;
      };

      $scope.selectStandardVorlage = function() {
        $scope.form.vorlage = undefined;
        $scope.form.datenExtrakt = false;
      };

      $scope.selectProjektVorlage = function(vorlage) {
        $scope.form.projektVorlageId = vorlage.id;
        $scope.form.vorlage = undefined;
        $scope.projektVorlage = vorlage;
        $scope.form.datenExtrakt = false;
      };

      $scope.selectFile = function(file) {
        if (file) {
          $scope.form.vorlage = file;
        }
      };
    },
    link: function($scope, $elem, $attrs) {
      $scope.$on('resetDirectiveGenerateReport', function(event) {
        var form = document.querySelector('[name=berichtForm]');
        $scope.form = {
          vorlage: undefined,
          projektVorlageId: undefined,
          pdfGenerieren: true,
          pdfAblegen: false,
          pdfDownloaden: true,
          pdfMerge: 'pdfMerge',
          datenExtrakt: false
        };
      });
    }
  };
});
