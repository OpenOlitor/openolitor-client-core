'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('ServerModel', function($resource, API_URL) {
    return $resource(API_URL + 'status/staticInfo/', { },
      {'query': {method:'GET', isArray: false}});
  });
