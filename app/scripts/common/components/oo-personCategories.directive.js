'use strict';

angular.module('openolitor-core').directive('ooPersonCategories', ['PersonCategoriesService',
  function(PersonCategoriesService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        personCategoriesList: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-personCategories.directive.html',
      controller: function($scope) {

        var rebuildPersonCategoriesList = function() {
          var usePersonCategoriesList = $scope.personCategoriesList || [] ;
          if ($scope.allPersonCategories) {
            $scope.personCategories = [];
            angular.forEach($scope.allPersonCategories, function(personCategory) {
              //check if system or custom personCategory, use only id
              var id = (personCategory.name) ? personCategory.name:
                personCategory;
              var index = usePersonCategoriestypenList.indexOf(id);
              if (id.length > 0 && index < 0) {
                $scope.personCategories.push(id);
              }
            });
          }
        };

        $scope.$watch(PersonCategoriesService.getPersonCategories,
          function(list) {
            if (list) {
              $scope.allPersonCategories = list;
              rebuildPersonCategoriesList();
            }
          });

        $scope.$watch($scope.personCategoriesList,
          function(list) {
              rebuildPersonCategoriesList();
          });

        // initialize the set personCategories
        var deregister = $scope.$watchCollection('personCategoriesList',
          function() {
            if ($scope.personCategoriesList && $scope.personCategoriesList.length >
              0) {
              rebuildPersonCategoriesList();
              deregister();
            }
          });

        $scope.addPersonCategory = function(personCategory) {
          $scope.personCategoriesList.push(personCategory);
          $scope.personCategoriesList.sort();
          rebuildPersonCategoriesList();
        };

        $scope.removePersonCategory = function(personCategory) {
          var index = $scope.personCategoriesList.indexOf(personCategory);
          if (index >= 0) {
            $scope.personCategoriesList.splice(index, 1);
          }
          rebuildPersonCategoriesList();
        };
      }
    };
  }
]);
