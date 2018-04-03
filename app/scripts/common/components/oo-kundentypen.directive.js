'use strict';

angular.module('openolitor-core').directive('ooKundentypen', ['KundentypenService',
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

        var rebuildKundentypenList = function() {
          var useKundentypenList = $scope.kundentypenList || [] ;
          if ($scope.allKundentypen) {
            $scope.kundentypen = [];
            angular.forEach($scope.allKundentypen, function(kundentyp) {
              //check if system or custom kundentyp, use only id
              var id = (kundentyp.kundentyp) ? kundentyp.kundentyp :
                kundentyp;
              var index = useKundentypenList.indexOf(id);
              if (id.length > 0 && index < 0) {
                $scope.kundentypen.push(id);
              }
            });
          }
        };

        $scope.$watch(KundentypenService.getKundentypen,
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
        };
      }
    };
  }
]);
