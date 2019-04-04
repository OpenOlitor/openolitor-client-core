'use strict';

angular.module('openolitor-core').filter('ooCHF', ['$filter', function($filter) {
  return function(value, showTag, currency) {
    var result = '';
    if(showTag) {
      result += currency + ' ' ;
    }
    result += $filter('number')(value, 2);
    return result;
  };
}]);
