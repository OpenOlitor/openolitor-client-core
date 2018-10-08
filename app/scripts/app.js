'use strict';

require('angular');
require('angular-animate');
require('angular-resource');
require('angular-route');
require('angular-sanitize');
require('angular-touch');
require('ng-table');
require('angular-file-saver');
require('angular-cookie');
require('ng-password-strength');
require('angular-messages');
require('angular-gettext');
require('angular-moment');
require('angular-file-saver');
require('ng1-lodash');
require('angular-cookies');
require('angular-filter');
require('angular-ui-bootstrap');
require('bootstrap-ui-datetime-picker');
require('angular-bootstrap-switch');
require('angularjs-color-picker');
require('ng-file-upload');
require('angular-sortable-view');
require('./lib/hamburger');
require('angular-loader');

var regexIso8601 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?$/;
// Matches YYYY-MM-ddThh:mm:ss.sssZ where .sss is optional
//var regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

var userRoles = {
  Guest: 'Guest',
  Administrator: 'Administrator',
  Kunde: 'Kunde'
};

function convertDateStringsToDates(input) {
  // Ignore things that aren't objects.
  if (typeof input !== 'object') {
    return input;
  }

  for (var key in input) {
    if (!input.hasOwnProperty(key)) {
      continue;
    }

    var value = input[key];
    var match;
    // Check for string properties which look like dates.
    if (typeof value === 'string' && (match = value.match(regexIso8601))) {
      var milliseconds = Date.parse(match[0]);
      if (!isNaN(milliseconds)) {
        input[key] = new Date(milliseconds);
      }
    } else if (typeof value === 'object') {
      // Recurse into object
      input[key] = convertDateStringsToDates(value);
    }
  }
  return input;
}

function addExtendedEnumValue(id, labelLong, labelShort, value) {
  return {
    id: id,
    label: {
      long: labelLong,
      short: labelShort
    },
    value: value
  };
}

/* This is a pseudo-function in order to enable gettext-extractor to find the translations that need to be done in the constants.
   As described in https://github.com/rubenv/angular-gettext/issues/67
*/
function gettext(string) {
  return string;
}

/**
 */
angular
  .module('openolitor-core', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTable',
    'ngFileSaver',
    'ngCookies',
    'ngPasswordStrength',
    'ngMessages',
    'angular.filter',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'color.picker',
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext',
    'ngHamburger',
    'angularMoment',
    'ngFileUpload',
    'ngLodash',
    'angular-sortable-view',
    'angular-loading-bar'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('ENV', '@@ENV')
  .constant('LIEFERRHYTHMEN', {
    WOECHENTLICH: gettext('Woechentlich'),
    ZWEIWOECHENTLICH: gettext('Zweiwoechentlich'),
    MONATLICH: gettext('Monatlich'),
    UNREGELMAESSIG: gettext('Unregelmaessig')
  })
  .constant('PREISEINHEITEN', {
    //JAHR: 'Jahr',
    //QUARTAL: 'Quartal',
    //MONAT: 'Monat',
    LIEFERUNG: gettext('Lieferung')
      //ABO: 'Aboende'
  })
  .constant('VERTRIEBSARTEN', {
    DEPOTLIEFERUNG: gettext('Depotlieferung'),
    HEIMLIEFERUNG: gettext('Heimlieferung'),
    POSTLIEFERUNG: gettext('Postlieferung')
  })
  .constant('LAUFZEITEINHEITEN', {
    UNBESCHRAENKT: gettext('Unbeschraenkt'),
    LIEFERUNGEN: gettext('Lieferungen'),
    MONATE: gettext('Monate')
  })
  .constant('FRISTEINHEITEN', {
    MONATE: 'Monate',
    WOCHEN: 'Wochen'
  })
  .constant('ANREDE', {
    KEINE: addExtendedEnumValue(undefined, gettext('Keine'), gettext('-')),
    HERR: addExtendedEnumValue('Herr', gettext('Herr'), gettext('Hr.')),
    FRAU: addExtendedEnumValue('Frau', gettext('Frau'), gettext('Fr.'))
  })
  .constant('ABOTYPEN', {
    DEPOTLIEFERUNGABO: gettext('DepotlieferungAbo'),
    HEIMLIEFERUNGABO: gettext('HeimlieferungAbo'),
    POSTLIEFERUNGABO: gettext('PostlieferungAbo')
  })
  .constant('LIEFERSTATUS', {
    UNGEPLANT: gettext('Ungeplant'),
    OFFEN: gettext('Offen'),
    ABGESCHLOSSEN: gettext('Abgeschlossen'),
    VERRECHNET: gettext('Verrechnet')
  })
  .constant('RECHNUNGSTATUS', {
    ERSTELLT: gettext('Erstellt'),
    VERSCHICKT: gettext('Verschickt'),
    BEZAHLT: gettext('Bezahlt'),
    MAHNUNG_VERSCHICKT: gettext('MahnungVerschickt'),
    STORNIERT: gettext('Storniert')
  })
  .constant('LIEFEREINHEIT', {
    STUECK: addExtendedEnumValue('Stueck', gettext('Stück'), gettext('St.')),
    BUND: addExtendedEnumValue('Bund', gettext('Bund'), gettext('Bu.')),
    GRAMM: addExtendedEnumValue('Gramm', gettext('Gramm'), gettext('gr')),
    KILOGRAMM: addExtendedEnumValue('Kilogramm', gettext('Kilogramm'),
      gettext('kg')),
    LITER: addExtendedEnumValue('Liter', gettext('Liter'), gettext('l'))
  })
  .constant('ABOTYPEN_ARRAY', ['DepotlieferungAbo', 'HeimlieferungAbo',
    'PostlieferungAbo'
  ])
  .constant('WAEHRUNG', {
    CHF: addExtendedEnumValue('CHF', gettext('Schweizer Franken'), gettext(
      'CHF')),
    EUR: addExtendedEnumValue('EUR', gettext('Euro'), gettext('EUR')),
    USD: addExtendedEnumValue('USD', gettext('US Dollar'), gettext('USD')),
    GBP: addExtendedEnumValue('GBP', gettext('Britisches Pfund'), gettext(
      'GBP')),
    CAD: addExtendedEnumValue('CAD', gettext('Kanadischer Dollar'), gettext(
      'CAD'))
  })
  .constant('LIEFERZEITPUNKTE', {
    MONTAG: addExtendedEnumValue('Montag', gettext('Montag'), gettext('MO'),
      1),
    DIENSTAG: addExtendedEnumValue('Dienstag', gettext('Dienstag'), gettext(
      'DI'), 2),
    MITTWOCH: addExtendedEnumValue('Mittwoch', gettext('Mittwoch'), gettext(
      'MI'), 3),
    DONNERSTAG: addExtendedEnumValue('Donnerstag', gettext('Donnerstag'),
      gettext('DO'), 4),
    FREITAG: addExtendedEnumValue('Freitag', gettext('Freitag'), gettext('FR'),
      5),
    SAMSTAG: addExtendedEnumValue('Samstag', gettext('Samstag'), gettext('SA'),
      6),
    SONNTAG: addExtendedEnumValue('Sonntag', gettext('Sonntag'), gettext('SO'),
      7)
  })
  .constant('MONATE', {
    JANUAR: addExtendedEnumValue('Januar', gettext('Januar'), gettext('Jan'),
      1),
    FEBRUAR: addExtendedEnumValue('Februar', gettext('Februar'), gettext(
      'Feb'), 2),
    MAERZ: addExtendedEnumValue('Maerz', gettext('März'), gettext('Mar'), 3),
    APRIL: addExtendedEnumValue('April', gettext('April'), gettext('Apr'), 4),
    MAI: addExtendedEnumValue('Mai', gettext('Mai'), gettext('Mai'), 5),
    JUNI: addExtendedEnumValue('Juni', gettext('Juni'), gettext('Jun'), 6),
    JULI: addExtendedEnumValue('Juli', gettext('Juli'), gettext('Jul'), 7),
    AUGUST: addExtendedEnumValue('August', gettext('August'), gettext('Aug'),
      8),
    SEPTEMBER: addExtendedEnumValue('September', gettext('September'),
      gettext('Sep'), 9),
    OKTOBER: addExtendedEnumValue('Oktober', gettext('Oktober'), gettext(
      'Okt'), 10),
    NOVEMBER: addExtendedEnumValue('November', gettext('November'), gettext(
      'Nov'), 11),
    DEZEMBER: addExtendedEnumValue('Dezember', gettext('Dezember'), gettext(
      'Dez'), 12)
  })
  .constant('PENDENZSTATUS', {
    AUSSTEHEND: gettext('Ausstehend'),
    ERLEDIGT: gettext('Erledigt'),
    NICHTERLEDIGT: gettext('NichtErledigt')
  })
  .constant('AUSLIEFERUNGSTATUS', {
    ERFASST: gettext('Erfasst'),
    AUSGELIEFERT: gettext('Ausgeliefert'),
  })
  .run(function($rootScope, $location) {
    $rootScope.location = $location;
  })
  .factory('checkSize', ['$rootScope', '$window', function($rootScope, $window) {
    return function() {
      if ($window.innerWidth >= 1200) {
        $rootScope.tgState = true;
      }
    };
  }])
  .factory('exportTable', ['FileSaver', function(FileSaver) {
    return function(tableController, fileName) {
      tableController.exportODS(function(file) {
        FileSaver.saveAs(file.response, fileName);
      });
    };
  }])
  .factory('exportODSModuleFunction', function() {
      return {
          params: {
            exportType: '.ods',
          },
          method: 'GET',
          responseType: 'arraybuffer',
          cache: true,
          transformResponse: function (data) {
              var file;
              if (data) {
                  file = new Blob([data], {
                      type: 'application/vnd.oasis.opendocument.spreadsheet'
                  });
              }
              return {
                  response: file
              };
          }
        };
  })
  .factory('cloneObj', function() {
    return function(obj) {
      return angular.copy(obj);
    };
  })
  .factory('msgBus', ['$rootScope', function($rootScope) {
    var msgBus = {};
    msgBus.emitMsg = function(msg) {
      $rootScope.$emit(msg.type, msg);
    };
    msgBus.onMsg = function(msg, scope, func) {
      var unbind = $rootScope.$on(msg, func);
      scope.$on('$destroy', unbind);
    };
    return msgBus;
  }])
  .run(['ooClientMessageService', function(clientMessageService) {
    console.log('Start clientMessageService');
    clientMessageService.start();
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData) {
      return convertDateStringsToDates(responseData);
    });
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .run(['alertService', '$rootScope', 'msgBus', 'gettextCatalog', function(alertService, $rootScope, msgBus, gettextCatalog) {
    $rootScope.$removeAlert = alertService.removeAlert();

    msgBus.onMsg('ChangeLang', $rootScope, function(event, msg) {
      console.log('Got ChangeLang Message'  + msg.reason);
      gettextCatalog.setCurrentLanguage(msg.reason);
    });
  }])
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$injector',
      function($log, $injector) {
        return function(exception) {
          // using the injector to retrieve services, otherwise circular dependency
          var alertService = $injector.get('alertService');
          alertService.addAlert('error', exception.message);
          // log error default style
          $log.error.apply($log, arguments);
        };
      }
    ]);
  }])
  .filter('fromNow', function(moment) {
    return function(input) {
      return moment(input).fromNow();
    };
  })
  .filter('lastElement', function() {
    return function(input, property) {
      if (!input) {
        return;
      }
      if (angular.isArray(input)) {
        if (!input[input.length - 1]) {
          return;
        } else if (property) {
          return input[input.length - 1][property];
        } else {
          return input[input.length - 1];
        }
      }
      if (input && property) {
        return input[property];
      } else {
        return input;
      }
    };
  })
  .filter('firstElement', function() {
    return function(input, property) {
      if (!input) {
        return;
      }
      if (angular.isArray(input)) {
        if (!input[0]) {
          return;
        } else if (property) {
          return input[0][property];
        } else {
          return input[0];
        }
      }
      if (input && property) {
        return input[property];
      } else {
        return input;
      }
    };
  })
  .filter('notIn', function() {
    return function(items, property, elements) {
      var filtered = [];
      if (!items) {
        return filtered;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var val = item[property];
        if (elements.indexOf(val) < 0) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .config(function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'scripts/login/login.html',
        controller: 'LoginController',
        name: 'Login',
        access: userRoles.Guest
      })
      .when('/passwd', {
        templateUrl: 'scripts/login/change_password.html',
        controller: 'LoginController',
        name: 'Passwortwechsel',
        access: [userRoles.Administrator, userRoles.Kunde]
      })
      .when('/logout', {
        templateUrl: 'scripts/login/logout.html',
        controller: 'LoginController',
        logout: true,
        name: 'Logout',
        access: userRoles.Guest
      })
      .when('/forbidden', {
        templateUrl: 'scripts/login/forbidden.html',
        controller: 'LoginController',
        name: 'Forbidden',
        access: userRoles.Guest
      })
      .when('/zugangaktivieren', {
        templateUrl: 'scripts/login/zugangaktivieren.html',
        controller: 'LoginController',
        name: 'Einladung',
        access: userRoles.Guest
      })
      .when('/passwordreset', {
        templateUrl: 'scripts/login/passwordreset.html',
        controller: 'LoginController',
        name: 'PasswordReset',
        access: userRoles.Guest
      })
      .otherwise({
        templateUrl: 'scripts/not-found.html',
        access: userRoles.Guest
      });
  });
