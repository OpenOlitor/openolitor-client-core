'use strict';

angular.module('openolitor-core').filter('ooPreisProEinheit', function(gettext, $filter) {
  return function(value,currency) {
    var result = '' +
      $filter('ooCurrency')(value.preis,currency, true) + ' ' +
      gettext('pro') + ' ' +
      gettext(value.preiseinheit);

    return result;
  };
});
