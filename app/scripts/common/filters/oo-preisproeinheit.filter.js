'use strict';

angular.module('openolitor-core').filter('ooPreisProEinheit', function(gettext, $filter) {
  return function(value,currency) {
    var result = '' +
      $filter('ooCHF')(value.preis,true,currency) + ' ' +
      gettext('pro') + ' ' +
      gettext(value.preiseinheit);

    return result;
  };
});
