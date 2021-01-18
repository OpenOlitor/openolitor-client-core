'use strict';

/**
 */
angular.module('openolitor-core')

  .factory('ProjektModel', ['$resource', 'appConfig', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'projekt/:id', {
    id: '@id'
    }, {'query': {method:'GET', isArray: false}
  });
  }]);
