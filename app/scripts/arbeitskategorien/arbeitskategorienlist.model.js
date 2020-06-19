'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('ArbeitskategorienModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'arbeitskategorien/:id', {
      id: '@id'
    });
  });
