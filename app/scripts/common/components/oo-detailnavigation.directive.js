'use strict';

/**
 * A directive for within detail navigation.
 */
angular.module('openolitor-core').directive('ooDetailNavigation', ['DetailNavigationService', '$location',
  function(DetailNavigationService, $location) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: true,
      templateUrl: 'scripts/common/components/oo-detailnavigation.directive.html',
      controller: function($scope) {
        $scope.getNext = function() {
          return DetailNavigationService.getNext();
        };

        $scope.getPrevious = function() {
          return DetailNavigationService.getPrevious();
        };

        $scope.navigateTo = function(id) {
          DetailNavigationService.detailFromWithin(id);
          $location.path($scope.getSubpath() + '/' + id);
        };

        $scope.getCurrentString = function() {
          return '' + DetailNavigationService.currentId + '/' + DetailNavigationService.idList.length;
        };

        $scope.getCurrentPosition = function() {
          return DetailNavigationService.getCurrentIndex() + 1;
        };

        $scope.getListSize = function() {
          return DetailNavigationService.getListSize();
        };

        $scope.getSubpath = function() {
          return DetailNavigationService.getSubpath();
        };

        $scope.getOverviewPath = function() {
          return '#' + DetailNavigationService.getOverviewPath();
        };
      }
    };
  }
]);
