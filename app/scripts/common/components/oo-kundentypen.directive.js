'use strict';

angular.module('openolitor').directive('ooKundentypen', ['KundentypenService',
  function(KundentypenService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        kundentypenList: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-kundentypen.directive.html',
      controller: function($scope) {

        var remove = function(kundentyp) {
          var index = $scope.kundentypen.indexOf(kundentyp);
          if (index >= 0) {
            $scope.kundentypen.splice(index, 1);
          }
        };


        var rebuildKundentypenList = function() {
          if ($scope.kundentypenList && $scope.allKundentypen) {
            $scope.kundentypen = $scope.allKundentypen.slice(0);
            //remove already selected kundentypen
            angular.forEach($scope.kundentypenList, function(id) {
              var index = $scope.kundentypen.indexOf(id);
              if (index >= 0) {
                $scope.kundentypen.splice(index, 1);
              }
            });
          }
        };

        var deregister = $scope.$watch(KundentypenService.getKundentypen,
          function(list) {
            if (list) {
              $scope.allKundentypen = list;
              rebuildKundentypenList();
            }
          });

        // initialize the set kundentypen
        var deregister = $scope.$watchCollection('kundentypenList',
          function() {
            if ($scope.kundentypenList && $scope.kundentypenList.length >
              0) {
              rebuildKundentypenList();
              deregister();
            }
          });

        $scope.addKundentyp = function(kundentyp) {
          $scope.kundentypenList.push(kundentyp);
          $scope.kundentypenList.sort();
          rebuildKundentypenList();
        };

        $scope.removeKundentyp = function(kundentyp) {
          var index = $scope.kundentypenList.indexOf(kundentyp);
          if (index >= 0) {
            $scope.kundentypenList.splice(index, 1);
          }
          rebuildKundentypenList();
        }
      }
    };
  }
]);
