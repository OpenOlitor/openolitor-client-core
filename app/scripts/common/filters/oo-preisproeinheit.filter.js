'use strict';

angular.module('openolitor-core').filter('ooPreisProEinheit', function(gettext, $filter) {
  return function(value) {
    var result = '' +
      gettext(value.waehrung) + ' ' +
      $filter('ooCHF')(value.preis) + ' ' +
      gettext('pro') + ' ' +
      gettext(value.preiseinheit);

    return result;
  };
});
