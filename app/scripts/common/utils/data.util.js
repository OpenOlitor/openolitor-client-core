'use strict';

angular.module('openolitor-core')
  .factory('DataUtil', function() {
    return {
      update: function(src, dest) {
        for (var key in src) {
          if (src.hasOwnProperty(key)) {
            dest[key] = src[key];
          }
        }
      }
    };
  });
