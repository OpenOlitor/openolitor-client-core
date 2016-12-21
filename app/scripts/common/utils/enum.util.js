'use strict';

angular.module('openolitor-core')
  .factory('EnumUtil', ['gettextCatalog', function(gettextCatalog) {
    return {
      asArray: function(e) {
        var result = [];
        angular.forEach(e, function(value) {
          this.push({
            id: value.id || value,
            label: value.label && value.label.long && gettextCatalog.getString(value
              .label.long) || gettextCatalog.getString(value),
            shortLabel: value.label && value.label.short && gettextCatalog.getString(
              value.label.short) || gettextCatalog.getString(value),
            title: gettextCatalog.getString(value),
            value: value.value || value
          });
        }, result);

        return result;
      }
    };
  }]);
