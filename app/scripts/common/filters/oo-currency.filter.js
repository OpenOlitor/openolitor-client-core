'use strict';

angular.module('openolitor-core').filter('ooCurrency', ['$filter', 'gettextCatalog','WAEHRUNG','EnumUtil','lodash', function($filter, gettextCatalog, WAEHRUNG, EnumUtil, lodash) {
  return function(value, currency, showTag) {
    var waehrungen = EnumUtil.asArray(WAEHRUNG);
    var result = '';
    var symbol = undefined;
    result += $filter('number')(value, 2);
    if(showTag) {
      var enumCurrency = lodash.find(waehrungen, function (i){
        if (i.id === currency){
          return i;
        }
      });
      if (enumCurrency === undefined){
        enumCurrency = waehrungen[0];
      }
      // currency symbol pre number
      if ((gettextCatalog.getCurrentLanguage() === 'en_US') ||
         (gettextCatalog.getCurrentLanguage() === 'de_DE') ||
         (gettextCatalog.getCurrentLanguage() === 'fr_CH') ||
         (gettextCatalog.getCurrentLanguage() === 'de_CH')) {
        result = enumCurrency.value + ' ' + result;
      } else {
        result = result + ' ' + enumCurrency.value;
      }
    }
    return result;
  };
}]);
