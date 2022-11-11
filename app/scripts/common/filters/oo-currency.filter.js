'use strict';

angular.module('openolitor-core').filter('ooCurrency', ['$rootScope', '$filter', 'gettextCatalog','WAEHRUNG','EnumUtil','lodash',
  function($rootScope, $filter, gettextCatalog, WAEHRUNG, EnumUtil, lodash) {
  return function(value, showTag, currency) {
    var waehrungen = EnumUtil.asArray(WAEHRUNG);
    var projektCurrency = undefined;
    if ($rootScope.projekt !== undefined && $rootScope.projekt.waehrung !== undefined ){
      var projektCurrency = $rootScope.projekt.waehrung;
    }
    var result = '';
    var symbol = undefined;
    result += $filter('number')(value, 2);
    if(showTag) {
      var enumCurrency = lodash.find(waehrungen, function (i){
        if (currency){
          if (i.id === currency){
            return i;
          }
        } else {
          if (i.id === projektCurrency){
            return i;
          }
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
