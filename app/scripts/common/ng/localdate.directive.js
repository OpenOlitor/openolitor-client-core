'use strict';

angular.module('openolitor-core').directive('localdate', function(moment) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(_scope, _element, _attr, _ngModel) {
      function from(input) {
        var result = moment(input).utc().startOf('day').toDate();
        console.log('setting', result, result.toISOString());
        return result;
      }

      _ngModel.$parsers.unshift(from);
    }
  };
});
