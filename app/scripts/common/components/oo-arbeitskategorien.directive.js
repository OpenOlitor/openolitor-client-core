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

        var remove = function(kundentyp) {
          var index = $scope.arbeitskategorien.indexOf(kundentyp);
          if (index >= 0) {
            $scope.arbeitskategorien.splice(index, 1);
          }
        };


        var rebuildArbeitskategorienList = function() {
          if ($scope.arbeitskategorienList && $scope.allArbeitskategorien) {
            $scope.arbeitskategorien = [];
            angular.forEach($scope.allArbeitskategorien, function(kundentyp) {
              //check if system or custom kundentyp, use only id
              var id = (kundentyp.kundentyp) ? kundentyp.kundentyp :
                kundentyp;
              var index = $scope.arbeitskategorienList.indexOf(id);
              if (index < 0) {
                $scope.arbeitskategorien.push(id);
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

        $scope.addArbeitskategorie = function(kundentyp) {
          $scope.arbeitskategorienList.push(kundentyp);
          $scope.arbeitskategorienList.sort();
          rebuildArbeitskategorienList();
        };

        $scope.removeArbeitskategorie = function(kundentyp) {
          var index = $scope.arbeitskategorienList.indexOf(kundentyp);
          if (index >= 0) {
            $scope.arbeitskategorienList.splice(index, 1);
          }
          rebuildArbeitskategorienList();
        }
      }
    };
  }
]);
