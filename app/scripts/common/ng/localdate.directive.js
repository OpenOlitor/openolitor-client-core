'use strict';

angular.module('openolitor-core').directive('localdate', function(moment) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(_scope, _element, _attr, _ngModel) {
      function from(input) {
        if (input) {
          // a temorary solution. there will be a time zone setting for the project in the future.
          var result = new Date(input.getTime() - input.getTimezoneOffset() * 60 * 1000);
          return result;
        }
        return input;
      }

      _ngModel.$parsers.unshift(from);
    }
  };
});
