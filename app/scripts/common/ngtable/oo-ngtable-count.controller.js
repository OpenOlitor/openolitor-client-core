'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('NgTableCountController', ['$scope', '$cookies',
    function($scope, $cookies) {

      var deepFind = function(obj, path) {
        var paths = path.split('.'),
          current = obj,
          i;

        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] === undefined) {
            return undefined;
          } else {
            current = current[paths[i]];
          }
        }
        return current;
      };

      var setCookie = function(count) {
        $cookies.put('ngTableCount', count);
      };

      var getCookie = function() {
        var r = $cookies.get('ngTableCount');
        if(angular.isUndefined(r)) {
          r = 25;
        }
        return r;
      };

      $scope.count = function(count) {
          if (count === 'maxValue' ){
              count = Number.MAX_VALUE
          }
        deepFind($scope.$parent, 'params').count(count);
        setCookie(count);
      };

      $scope.fetchStoredCount = function() {
        return getCookie();
      };

      deepFind($scope.$parent, 'params').count($scope.fetchStoredCount());
    }
  ]
);
