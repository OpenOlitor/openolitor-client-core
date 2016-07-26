'use strict';

angular.module('openolitor-core').directive('ooErrorOverlay', function() {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'scripts/common/components/oo-erroroverlay.directive.html',
    scope: true
  };
});
