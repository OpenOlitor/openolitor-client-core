'use strict';

angular.module('openolitor-core').directive('ooArbeitskategorien', ['ArbeitskategorienService',
  function(ArbeitskategorienService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        arbeitskategorienList: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-arbeitskategorien.directive.html',
      controller: function($scope) {

        var rebuildArbeitskategorienList = function() {
          var useArbeitskategorienList = $scope.arbeitskategorienList || [] ;
          if ($scope.allArbeitskategorien) {
            $scope.arbeitskategorien = [];
            angular.forEach($scope.allArbeitskategorien, function(arbeitskategorie) {
              var beschreibung = (arbeitskategorie.beschreibung) ? arbeitskategorie.beschreibung :
                arbeitskategorie;
              var index = useArbeitskategorienList.indexOf(beschreibung);
              if (beschreibung.length > 0 && index < 0) {
                $scope.arbeitskategorien.push(beschreibung);
              }
            });
          }
        };

        $scope.$watch(ArbeitskategorienService.getArbeitskategorien,
          function(list) {
            if (list) {
              $scope.allArbeitskategorien = list;
              rebuildArbeitskategorienList();
            }
          });

        // initialize the set arbeitskategorien
        var deregister = $scope.$watchCollection('arbeitskategorienList',
          function() {
            if ($scope.arbeitskategorienList && $scope.arbeitskategorienList.length >
              0) {
              rebuildArbeitskategorienList();
              deregister();
            }
          });

        $scope.addArbeitskategorie = function(arbeitskategorie) {
          $scope.arbeitskategorienList.push(arbeitskategorie);
          $scope.arbeitskategorienList.sort();
          rebuildArbeitskategorienList();
        };

        $scope.removeArbeitskategorie = function(arbeitskategorie) {
          var index = $scope.arbeitskategorienList.indexOf(arbeitskategorie);
          if (index >= 0) {
            $scope.arbeitskategorienList.splice(index, 1);
          }
          rebuildArbeitskategorienList();
        };
      }
    };
  }
]);
