'use strict';

angular.module('openolitor-core').directive('ooSlidingDetail',
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        slideIn: '&',
        slideOutFunction: '=?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-sliding-detail.directive.html',
      controller: function($scope) {

        $scope.$watch($scope.slideIn,
          function(res) {
            if (res) {
              $scope.openNav();
            } else {
              $scope.closeNav();
            }
          });

        /* Set the width of the side navigation to 250px */
        $scope.openNav = function() {
          $scope.stateStyle = {width: '400px',right:'0','overflow-x':'scroll'};
        };

        /* Set the width of the side navigation to 0 */
        $scope.closeNav = function() {
          $scope.stateStyle = {width: '0',right:'-20px'};
        };

        $scope.callFctSlideOut = function() {
          if(angular.isDefined($scope.slideOutFunction) && typeof $scope.slideOutFunction === 'function') {
            $scope.slideOutFunction();
          } else {
            $scope.closeNav();
          }
        };
      }
    };
  });
