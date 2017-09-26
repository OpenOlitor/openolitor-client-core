'use strict';

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

'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope',
    'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment',
    '$location', 'msgBus', 'checkSize', '$window', '$timeout', 'BUILD_NR',
    'ENV', 'ooAuthService', '$cookies',
    function($scope, $rootScope, ServerService, ProjektService,
      gettextCatalog, amMoment, $location, msgBus, checkSize, $window,
      $timeout, BUILD_NR, ENV, ooAuthService, $cookies) {
      angular.element($window).bind('resize', function() {
        checkSize();
      });

      $scope.currentPathContains = function(pathJunk) {
        return $location.url().indexOf(pathJunk) !== -1;
      };

      //initial launch
      checkSize();

      $scope.connected = false;

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);
        $scope.user = user;

        if($scope.loggedIn) {
          ProjektService.resolveProjekt().then(function(projekt) {
            $scope.projekt = projekt;
            $rootScope.projekt = projekt;
          });
        }
      });

      $timeout(function() {
        $scope.menushow[angular.element('.sidebar-nav .active').parent()
          .attr(
            'activate-id')] = true;
      }, 0);

      var unwatchStaticServerInfo = $scope.$watch(ServerService.getStaticServerInfo,
        function(info) {
          if (!angular.isUndefined(info)) {
            $scope.serverInfo = info;
            $scope.connected = true;
          }
        });

      $scope.buildNr = BUILD_NR;
      $scope.env = ENV;

      msgBus.onMsg('WebSocketClosed', $rootScope, function(event, msg) {
        $scope.connected = false;
        $scope.messagingSocketClosedReason = msg.reason;
        if(angular.isUndefined($scope.messagingSocketClosedSetter)) {
          $scope.messagingSocketClosedSetter = $timeout(function() {
            $scope.showConnectionErrorMessage = true;
            $scope.messagingSocketClosedSetter = undefined;
          }, 30000);
        }
        $scope.$apply();
      });

      msgBus.onMsg('WebSocketOpen', $rootScope, function() {
        $scope.connected = true;
        $scope.showConnectionErrorMessage = false;
        if(!angular.isUndefined($scope.messagingSocketClosedSetter) &&
          !angular.isUndefined($scope.messagingSocketClosedSetter.close)) {
          $scope.messagingSocketClosedSetter.close();
          $scope.messagingSocketClosedSetter = undefined;
        }
        $scope.messagingSocketClosedReason = '';
        $scope.$apply();
      });

      $scope.changeLang = function(lang) {
        if (!angular.isUndefined(lang)) {
          gettextCatalog.setCurrentLanguage(lang);
          amMoment.changeLocale(lang);
          $scope.storeActiveLang(lang);
          $scope.$emit('languageChanged');
        }
      };

      $scope.activeLang = function() {
        return gettextCatalog.getCurrentLanguage();
      };

      $scope.storedActiveLang = function() {
        return $cookies.get('activeLang');
      };

      $scope.storeActiveLang = function(lang) {
        $cookies.put('activeLang', lang);
      };

      if (angular.isUndefined($scope.storedActiveLang())) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        if(lang.indexOf('de-') > 0) {
          $scope.changeLang('de');
        } else if(lang.indexOf('fr-') > 0) {
          $scope.changeLang('fr');
        } else if(lang.indexOf('en-') > 0) {
          $scope.changeLang('en');
        } else {
          $scope.changeLang('de');
        }
      } else {
        $scope.changeLang($scope.storedActiveLang());
      }

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
        unwatchStaticServerInfo();
      });

    }
  ]);

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

'use strict';

angular.module('openolitor-core').filter('ooCHF', ['$filter', function($filter) {
  return function(value, showTag) {
    var result = '';
    if(showTag) {
      result += 'CHF ';
    }
    result += $filter('number')(value, 2);
    return result;
  };
}]);

'use strict';

angular.module('openolitor-core').directive('ooErrorOverlay', function() {
  return {
    restrict: 'AE',
    transclude: true,
    templateUrl: 'scripts/common/components/oo-erroroverlay.directive.html',
    scope: true
  };
});

'use strict';

angular.module('openolitor-core').directive('ooDropdown', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      placeholder: '@',
      values: '=',
      selected: '=',
      selectedProp: '@',
      selectedFunction: '&?',
      selectedFunctionScope: '=',
      property: '@',
      displayFunction: '=',
      dropdownId: '@',
      displayStyle: '@',
      label: '=',
      disabled: '=',
      selectionRequired: '='
    },
    templateUrl: 'scripts/common/components/oo-dropdown.directive.html',
    compile: function(element, attrs) {
      if (!attrs.displayStyle) {
        attrs.displayStyle = 'navbar';
      }
    },
    controller: function($scope) {

      $scope.listVisible = false;
      $scope.display = '';
      $scope.isPlaceholder = true;
      $scope.selectedItem = undefined;

      var deepFind = function(obj, path) {
        var paths = path.split('.'),
          current = obj,
          i;

        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] === undefined) {
            return undefined;
          } else {
            current = current[paths[i]];
          }
        }
        return current;
      };

      $scope.select = function(item) {
        $scope.isPlaceholder = false;
        if (angular.isDefined($scope.selectedProp)) {
          $scope.selected = deepFind(item, $scope.selectedProp);
        } else {
          $scope.selected = item;
        }
        $scope.selectedItem = item;
        if (angular.isDefined($scope.selectedFunction)) {
          if ($scope.selectedFunction()($scope.selectedItem, $scope.selectedFunctionScope)) {
            //if functions returns 'true', selection is reset
            $scope.selectedItem = undefined;
            $scope.selected = undefined;
          }
        }
        $scope.updateDisplay();
      };

      $scope.getDisplayedText = function(item) {
        if (!angular.isUndefined($scope.property)) {
          return deepFind(item, $scope.property);
        } else if (!angular.isUndefined($scope.displayFunction)) {
          return $scope.displayFunction(item);
        } else {
          return item;
        }
      };

      $scope.getClass = function() {
        if ($scope.selectionRequired && angular.isUndefined($scope.selected)) {
          return 'oo-invalid';
        } else {
          return '';
        }
      };

      $scope.updateDisplay = function() {
        $scope.isPlaceholder = angular.isUndefined($scope.selected);
        if (!angular.isUndefined($scope.displayFunction) && !angular.isUndefined(
            $scope.selectedItem)) {
          $scope.display = $scope.displayFunction($scope.selectedItem);
        } else if ($scope.property) {
          if (!angular.isUndefined($scope.selected) && angular.isUndefined(
              $scope.selectedItem)) {
            //initial state, get selected item to display
            angular.forEach($scope.values, function(value) {
              if (!angular.isUndefined($scope.selectedProp)) {
                if (deepFind(value, $scope.selectedProp) === $scope
                  .selected) {
                  $scope.display = deepFind(value, $scope.property);
                }
              } else {
                if (value === $scope.selected) {
                  $scope.display = value;
                }
              }
            });
          } else if (!angular.isUndefined($scope.selectedItem)) {
            $scope.display = deepFind($scope.selectedItem, $scope.property);
          }
        } else {
          if (!angular.isUndefined($scope.selected) && angular.isUndefined(
              $scope.selectedItem)) {
            $scope.display = $scope.selected;
          } else {
            $scope.display = $scope.selectedItem;
          }
        }
      };
      $scope.updateDisplay();

      $scope.unwatchSelected = $scope.$watch('selected', function() {
        if (!angular.isUndefined($scope.selected)) {
          $scope.updateDisplay();
        }
      }, true);

    }
  };
});

'use strict';

angular.module('openolitor-core').directive('ooLiefertage', ['EnumUtil',
  'LIEFERZEITPUNKTE',
  function(EnumUtil, LIEFERZEITPUNKTE) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        liefertag: '=',
        required: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-liefertage.directive.html',
      controller: function($scope) {
        $scope.liefertage = EnumUtil.asArray(LIEFERZEITPUNKTE);

        $scope.isSelected = function(liefertag) {
          return ($scope.liefertag && $scope.liefertag === liefertag.id) ?
            'active' : '';
        };

        $scope.selectedLiefertag = function(liefertag) {
          $scope.liefertag = liefertag.id;
        };
      }
    };
  }
]);

'use strict';

// based on the works of https://github.com/zhaber/angular-js-bootstrap-datetimepicker
angular.module('openolitor-core')
  .directive('ooDatepickerPopup', function() {
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function(scope, element, attr, controller) {
        //remove the default formatter from the input directive to prevent conflict
        controller.$formatters.shift();
      }
    };
  })
  .directive('ooDatepicker', [
    function() {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          ngClass: '=',
          dayFormat: '=',
          monthFormat: '=',
          yearFormat: '=',
          dayHeaderFormat: '=',
          dayTitleFormat: '=',
          monthTitleFormat: '=',
          startingDay: '=',
          yearRange: '=',
          dateFormat: '=',
          minDate: '=',
          maxDate: '=',
          dateOptions: '=',
          dateDisabled: '&',
          hourStep: '=',
          minuteStep: '=',
          showMeridian: '=',
          meredians: '=',
          mousewheel: '=',
          readonlyTime: '=',
          readonlyDate: '=',
          ngChange: '='
        },
        template: function(elem, attrs) {
          function dashCase(name) {
            return name.replace(/[A-Z]/g, function(letter, pos) {
              return (pos ? '-' : '') + letter.toLowerCase();
            });
          }

          function createAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + dateTimeAttr + '\" ';
            } else {
              return '';
            }
          }

          function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + dateTimeAttr + '({' + funcArgs + '})\" ';
            } else {
              return '';
            }
          }

          function createEvalAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + attrs[dateTimeAttr] + '\" ';
            } else {
              return dashCase(innerAttr) + ' ';
            }
          }

          function createAttrConcat(previousAttrs, attr) {
            return previousAttrs + createAttr.apply(null, attr);
          }
          var tmpl = '<div class=\"datetimepicker-wrapper\">' +
            '<input class=\"form-control\" type=\"text\" ' +
            'ng-click=\"open($event)\" ' +
            'ng-change=\"ngChange\" ' +
            'is-open=\"opened\" ' +
            'ng-class=\"ngClass\" ' +
            'ng-model=\"ngModel\" ' + [
              ['minDate'],
              ['maxDate'],
              ['dayFormat'],
              ['monthFormat'],
              ['yearFormat'],
              ['dayHeaderFormat'],
              ['dayTitleFormat'],
              ['monthTitleFormat'],
              ['startingDay'],
              ['yearRange'],
              ['datepickerOptions', 'dateOptions'],
              ['ngDisabled', 'readonlyDate']
            ].reduce(createAttrConcat, '') +
            createFuncAttr('dateDisabled', 'date: date, mode: mode') +
            createEvalAttr('uibDatepickerPopup', 'dateFormat') +
            createEvalAttr('currentText', 'currentText') +
            createEvalAttr('clearText', 'clearText') +
            createEvalAttr('closeText', 'closeText') +
            createEvalAttr('placeholder', 'placeholder') +
            '/>\n' +
            '</div>\n';
          return tmpl;
        },
        controller: ['$scope',
          function($scope) {
            $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.opened = true;
            };
          }
        ]
      };
    }
  ]);


'use strict';

angular.module('openolitor-core').directive('ooKundentypen', ['KundentypenService',
  function(KundentypenService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        kundentypenList: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-kundentypen.directive.html',
      controller: function($scope) {

        var remove = function(kundentyp) {
          var index = $scope.kundentypen.indexOf(kundentyp);
          if (index >= 0) {
            $scope.kundentypen.splice(index, 1);
          }
        };


        var rebuildKundentypenList = function() {
          if ($scope.kundentypenList && $scope.allKundentypen) {
            $scope.kundentypen = [];
            angular.forEach($scope.allKundentypen, function(kundentyp) {
              //check if system or custom kundentyp, use only id
              var id = (kundentyp.kundentyp) ? kundentyp.kundentyp :
                kundentyp;
              var index = $scope.kundentypenList.indexOf(id);
              if (index < 0) {
                $scope.kundentypen.push(id);
              }
            });
          }
        };

        $scope.$watch(KundentypenService.getKundentypen,
          function(list) {
            if (list) {
              $scope.allKundentypen = list;
              rebuildKundentypenList();
            }
          });

        // initialize the set kundentypen
        var deregister = $scope.$watchCollection('kundentypenList',
          function() {
            if ($scope.kundentypenList && $scope.kundentypenList.length >
              0) {
              rebuildKundentypenList();
              deregister();
            }
          });

        $scope.addKundentyp = function(kundentyp) {
          $scope.kundentypenList.push(kundentyp);
          $scope.kundentypenList.sort();
          rebuildKundentypenList();
        };

        $scope.removeKundentyp = function(kundentyp) {
          var index = $scope.kundentypenList.indexOf(kundentyp);
          if (index >= 0) {
            $scope.kundentypenList.splice(index, 1);
          }
          rebuildKundentypenList();
        }
      }
    };
  }
]);

'use strict';

angular.module('openolitor-core').directive('ooArbeitskategorien', ['ArbeitskategorienService',
  function(ArbeitskategorienService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        arbeitskategorienList: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-arbeitskategorien.directive.html',
      controller: function($scope) {

        var remove = function(kundentyp) {
          var index = $scope.arbeitskategorien.indexOf(kundentyp);
          if (index >= 0) {
            $scope.arbeitskategorien.splice(index, 1);
          }
        };


        var rebuildArbeitskategorienList = function() {
          if ($scope.arbeitskategorienList && $scope.allArbeitskategorien) {
            $scope.arbeitskategorien = [];
            angular.forEach($scope.allArbeitskategorien, function(kundentyp) {
              //check if system or custom kundentyp, use only id
              var id = (kundentyp.kundentyp) ? kundentyp.kundentyp :
                kundentyp;
              var index = $scope.arbeitskategorienList.indexOf(id);
              if (index < 0) {
                $scope.arbeitskategorien.push(id);
              }
            });
          }
        };

        $scope.$watch(ArbeitskategorienService.getArbeitskategorien,
          function(list) {
            if (list) {
              $scope.allArbeitskategorien = list;
              rebuildArbeitskategorienList();
            }
          });

        // initialize the set arbeitskategorien
        var deregister = $scope.$watchCollection('arbeitskategorienList',
          function() {
            if ($scope.arbeitskategorienList && $scope.arbeitskategorienList.length >
              0) {
              rebuildArbeitskategorienList();
              deregister();
            }
          });

        $scope.addArbeitskategorie = function(kundentyp) {
          $scope.arbeitskategorienList.push(kundentyp);
          $scope.arbeitskategorienList.sort();
          rebuildArbeitskategorienList();
        };

        $scope.removeArbeitskategorie = function(kundentyp) {
          var index = $scope.arbeitskategorienList.indexOf(kundentyp);
          if (index >= 0) {
            $scope.arbeitskategorienList.splice(index, 1);
          }
          rebuildArbeitskategorienList();
        }
      }
    };
  }
]);

'use strict';

angular.module('openolitor-core').directive('ooSaveButton', ['msgBus',
  'gettext',
  'alertService', 'DataUtil',
  function(msgBus, gettext, alertService, DataUtil) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        onSave: '=',
        onCancel: '=',
        form: '=',
        onCreated: '=',
        condensed: '@?',
        notext: '@?',
        small: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-savebutton.directive.html',
      controller: function($scope) {

        if (!angular.isUndefined($scope.condensed) && $scope.condensed) {
          $scope.notext = true;
          $scope.small = true;
        }

        $scope.isNew = function() {
          return !$scope.model || $scope.model.id === undefined;
        };

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };

        msgBus.onMsg('EntityModified', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && !angular.isUndefined(
              $scope.model) && msg.data.id === $scope.model
            .id) {
            DataUtil.update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            $scope.$apply();
          }
        });

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if ($scope.model && entityMatches(msg.entity) && msg.data.id ===
            $scope.model.id) {
            DataUtil.update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            if ($scope.onCreated) {
              $scope.onCreated(msg.data.id);
            }
            $scope.$apply();
          }
        });

        $scope.save = function() {
          $scope.model.actionInProgress = 'updating';
          var ret = $scope.onSave($scope.model);
          if (!angular.isUndefined(ret.catch)) {
            ret.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('error', gettext($scope.entity +
                  ' konnte nicht gespeichert werden. Fehler: ') +
                req.status +
                '-' + req.statusText + ':' + req.data
              );
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };


        $scope.cancel = function() {
          $scope.model.actionInProgress = 'updating';
          $scope.onCancel();
        };
      }
    };
  }
]);

'use strict';

/**
 * OO Actions Button Directive
 * @namespace Directives
 *
 * @description
 * This directive adds a split button dropdown for the given array of actions.
 *
 * @scope
 *
 * @param {string} entity The entity that will be used to match messages.
 * @param {Array.<Object>=} entities Multiple entities that will be used to match messages.
 * @param {Object} model The related angular resource.
 * @param {Array.<Object>} actions An array of actions of the form:
 *                         {
 *                           iconClass: string, // if left undefined, a save icon will be used
 *                           label: string, // either label or labelFunction has to be defined
 *                           labelFunction: function, // optional
 *                           noText: boolean, // optional
 *                           noEntityText: boolean, // optional
 *                           onExecute: function(model), // will be executed on click
 *                           isDisabled: function(model),
 *                           isHidden: function(model) // hide this action
 *                         }
 */
angular.module('openolitor-core').directive('ooActionsButton', ['msgBus', 'gettext',
  'alertService', 'DataUtil', 'dialogService',
  function(msgBus, gettext, alertService, DataUtil, dialogService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        actions: '=',
        form: '=',
        confirm: '@?',
        condensed: '@?',
        small: '@?',
        onCreated: '=',
        btnStyle: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-actionsbutton.directive.html',
      controller: function($scope) {

        if(angular.isUndefined($scope.btnStyle) || !$scope.btnStyle) {
          $scope.btnStyle = 'btn-primary';
        }

        if (!angular.isUndefined($scope.condensed) && $scope.condensed) {
          $scope.notext = true;
          $scope.small = true;
        }

        $scope.isNew = function() {
          return !$scope.model || $scope.model.id === undefined;
        };

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };

        msgBus.onMsg('EntityModified', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && !angular.isUndefined(
              $scope.model) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'updating') {
              if ($scope.entity) {
                alertService.addAlert('info', $scope.entity + gettext(
                  ' wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.'
                ));
              }
            } else {
              DataUtil.update(msg.data, $scope.model);
              $scope.model.actionInProgress = undefined;
              $scope.$apply();
            }
          }
        });

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if ($scope.model && entityMatches(msg.entity) && msg.data.id ===
            $scope.model.id) {
            DataUtil.update(msg.data, $scope.model);
            $scope.model.actionInProgress = undefined;
            if ($scope.onCreated) {
              $scope.onCreated(msg.data.id);
            }
            $scope.$apply();
          }
        });

        var errorMessage = function(action, entity, status, statusText, errorData) {
          var actionText = gettext(action.label || action.labelFunction());
          var errorText = gettext(errorData.message);
          var entityText = entity && gettext($scope.entity) + ': ';
          alertService.addAlert('error',
            entityText +
            gettext('Aktion') + ' "' +
            actionText + '" ' +
            gettext('konnte nicht ausgeführt werden. Fehler:') + ' ' +
            status + '-' + gettext(statusText) + ': ' +
            errorText
          );
        };

        $scope.execute = function(action) {
          if((!angular.isDefined(action.confirm) || action.confirm) &&
            (angular.isDefined($scope.confirm) && $scope.confirm)) {
            dialogService.displayDialogOkAbort(action.confirmMessage,
              function() {
                $scope.executeAction(action);
              });
            } else {
              $scope.executeAction(action);
            }
        };

        $scope.executeAction = function(action) {
          $scope.model.actionInProgress = 'updating';
          var result = action.onExecute($scope.model);
          if (result && result.catch) {
            result.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              errorMessage(action, $scope.entity, req.status, req.statusText, req.data);
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };
      }
    };
  }
]);

'use strict';

angular.module('openolitor-core').directive('ooDeleteButton', ['msgBus', 'gettext',
  'alertService', '$uibModal',
  function(msgBus, gettext, alertService, $uibModal) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        entity: '@',
        entities: '=?',
        model: '=',
        onDelete: '=',
        form: '=',
        onDeleted: '=',
        confirm: '@?',
        confirmMessage: '=?',
        condensed: '@?',
        notext: '@?',
        small: '@?',
        buttonClass: '@?'
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-deletebutton.directive.html',
      controller: function($scope) {

        if(!angular.isUndefined($scope.condensed) && $scope.condensed) {
          $scope.notext = true;
          $scope.small = true;
        }

        var entityMatches = function(entity) {
          if (angular.isArray($scope.entities)) {
            return $scope.entities.indexOf(entity) > -1;
          } else {
            return $scope.entity === entity;
          }
        };
        msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
          if (entityMatches(msg.entity) && msg.data.id === $scope.model
            .id) {
            if ($scope.model.actionInProgress !== 'deleting') {
              alertService.addAlert('info', gettext($scope.entity +
                ' wurde durch eine andere Person gelöscht.'));
            } else {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('info', gettext($scope.entity +
                ' wurde erfolgreich gelöscht.'));
              $scope.$apply();
            }
            //redirect to main page
            if(angular.isDefined($scope.onDeleted)) {
              $scope.onDeleted(msg.data.id);
            }
          }
        });

        $scope.getButtonTypeClass = function() {
          if(angular.isUndefined($scope.buttonClass)) {
            return 'btn-danger';
          } else {
            return $scope.buttonClass;
          }
        };

        $scope.modalDialog = function(executeOnOK) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/common/components/oo-deletebutton.directive.modal.html',
            controller: 'ooDeleteButtonModalInstanceCtrl',
            resolve: {
              message: function() {
                return $scope.confirmMessage;
              }
            }
          });

          modalInstance.result.then(function () {
            executeOnOK();
          });
        };

        $scope.delete = function() {
          if(angular.isDefined($scope.confirm) && $scope.confirm) {
            $scope.modalDialog($scope.deleteAction);
          } else {
            $scope.deleteAction();
          }
        };

        $scope.deleteAction = function() {
          $scope.model.actionInProgress = 'deleting';
          var ret = $scope.onDelete($scope.model);
          if(ret && !angular.isUndefined(ret.catch)) {
            ret.catch(function(req) {
              $scope.model.actionInProgress = undefined;
              alertService.addAlert('error', gettext($scope.entity +
                  ' konnte nicht gelöscht werden. Fehler: ') +
                req.status +
                '-' + req.statusText + ':' + req.data
              );
            });
          } else {
            $scope.model.actionInProgress = undefined;
          }
        };
      }
    };
  }
]);

angular.module('openolitor-core').controller('ooDeleteButtonModalInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

'use strict';

angular.module('openolitor-core').controller('ooDialogOkAbortModalInstanceCtrl', function ($scope, $uibModalInstance, message) {

  $scope.message = message;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

'use strict';

angular.module('openolitor-core').directive('ooStopEvent', [function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('click', function(e) {
        e.stopPropagation();
      });
    }
  };
}]);

'use strict';

angular.module('openolitor-core').directive('ooGenerateReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      postPath: '=',
      onGenerated: '&',
      onClose: '&',
      defaultFileName: '=',
      ids: '=?',
      projektVorlagen: '=?',
      directDownload: '=?'
    },
    templateUrl: 'scripts/common/components/oo-generate-report.directive.html',
    controller: function($scope, $http, API_URL, FileUtil, gettext, lodash,
      alertService) {
      $scope.form = {
        vorlage: undefined,
        projektVorlageId: undefined,
        pdfGenerieren: true,
        pdfAblegen: false,
        pdfDownloaden: true,
        datenExtrakt: false
      };

      var generateWithFormData = function(formData) {
        $scope.error = undefined;
        $http.post(API_URL + $scope.postPath, formData, {
          //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
          // but this is not true because when we are sending up files the request
          // needs to include a 'boundary' parameter which identifies the boundary
          // name between parts in this multi-part request and setting the Content-type
          // manually will not set this boundary parameter. For whatever reason,
          // setting the Content-type to 'false' will force the request to automatically
          // populate the headers properly including the boundary parameter.
          headers: {
            'Content-Type': undefined
          },
          // angular.identity prevents Angular to do anything on our data (like serializing it).
          transformRequest: angular.identity
            // responseType: 'arraybuffer'
        }).then(function(res) {
          // handle json result
          if (res.data.validationErrors && res.data.validationErrors
            .length > 0) {
            var distinctErrors = lodash.groupBy(res.data.validationErrors,
              'message');
            var errors = Object.keys(distinctErrors);
            var details = lodash.map(errors,
              function(error) {
                return error + '(' + distinctErrors[error].length +
                  ')';
              });
            alertService.addAlert('warning',
              gettext(
                'Beim erstellen der Dokumente sind folgende Fehler aufgetreten'
              ),
              details
            );
          } else if($scope.form.datenExtrakt || (!angular.isUndefined($scope.directDownload) && $scope.directDownload)) {
            // assume file download
            var name = res.headers('Content-Disposition');
            var json = JSON.stringify(res.data);
            FileUtil.open(name || $scope.defaultFileName, [json], {
              type: 'application/json'
            });
          }
          $scope.generating = false;
          $scope.onGenerated()();
        }, function(response) {
          console.log('Failed generating report', response);
          $scope.generating = false;
          $scope.error = gettext(
            'Bericht konnte nicht erzeugt werden');
        });
      };

      $scope.generate = function() {
        var fd = new FormData();
        //add dummy parameter to create correct multipart request on empty form data
        fd.append('report', true);
        for (var key in $scope.form) {
          if ($scope.form[key]) {
            fd.append(key, $scope.form[key]);
          }
        }
        if ($scope.ids && angular.isArray($scope.ids)) {
          fd.append('ids', $scope.ids.toString());
        }
        $scope.generating = true;
        generateWithFormData(fd);
      };

      $scope.selectDatenExtrakt = function() {
        $scope.form.vorlage = undefined;
        $scope.form.datenExtrakt = true;
        $scope.form.projektVorlageId = undefined;
      };

      $scope.selectStandardVorlage = function() {
        $scope.form.vorlage = undefined;
        $scope.form.datenExtrakt = false;
      };

      $scope.selectProjektVorlage = function(vorlage) {
        $scope.form.projektVorlageId = vorlage.id;
        $scope.form.vorlage = undefined;
        $scope.projektVorlage = vorlage;
        $scope.form.datenExtrakt = false;
      };

      $scope.selectFile = function(file) {
        if (file) {
          $scope.form.vorlage = file;
        }
      };
    }
  };
});

'use strict';

//Based on https://github.com/logicbomb/lvlDragDrop

angular.module('openolitor-core').factory('uuid', function() {
    var svc = {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+'000000000').substr(2,8);
                return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        empty: function() {
          return '00000000-0000-0000-0000-000000000000';
        }
    };

    return svc;
});

'use strict';

//Based on https://github.com/logicbomb/lvlDragDrop

angular.module('openolitor-core').directive('ooDraggable', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            ooDragedType: '='
        },
        link: function (scope, el, attrs, controller) {
            angular.element(el).attr('draggable', 'true');

            var id = angular.element(el).attr('id');

            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }
            el.bind('dragstart', function (e) {
                e.originalEvent.dataTransfer.setData('text', '{ \"data\": \"' + id + '\", \"type\": \"' + scope.ooDragedType + '\" }');
                $rootScope.$emit('OO-DRAG-START');
            });

            el.bind('dragend', function (e) {
                $rootScope.$emit('OO-DRAG-END');
            });
        }
    };
}]);

angular.module('openolitor-core').directive('ooDropTarget', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function (scope, el, attrs, controller) {
            var id = angular.element(el).attr('id');
            var enteredCounter = 0;
            if (!id) {
                id = uuid.new();
                angular.element(el).attr('id', id);
            }

            el.bind('dragover', function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            el.bind('dragenter', function (e) {
              if (e.preventDefault) {
                  e.preventDefault(); // Necessary. Allows us to drop.
              }
              if(enteredCounter === 0) {
                angular.element('#'+id).addClass('oo-over');
              }
              enteredCounter += 1;
            });

            el.bind('dragleave', function (e) {
              if (e.preventDefault) {
                  e.preventDefault(); // Necessary. Allows us to drop.
              }
              enteredCounter -= 1;
              if(enteredCounter === 0) {
                angular.element('#'+id).removeClass('oo-over');  // this / e.target is previous target element.
              }
            });

            el.bind('drop', function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var dataRaw = e.originalEvent.dataTransfer.getData('text');
                var dataObj = JSON.parse(dataRaw);

                var data = dataObj.data;
                var type = dataObj.type;

                enteredCounter = 0;
                $rootScope.$emit('OO-DRAG-END');
                scope.onDrop({dragEl: data, dropEl: id, type: type});
            });

            $rootScope.$on('OO-DRAG-START', function () {
                var el = document.getElementById(id);
                angular.element(el).addClass('oo-target');
            });

            $rootScope.$on('OO-DRAG-END', function () {
                var el = angular.element('#'+id);
                el.removeClass('oo-target');
                el.removeClass('oo-over');
            });
        }
    };
}]);

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

'use strict';

angular.module('openolitor-core')
  .factory('DataUtil', function() {
    return {
      update: function(src, dest) {
        for (var key in src) {
          if (src.hasOwnProperty(key)) {
            dest[key] = src[key];
          }
        }
      }
    };
  });

'use strict';

angular.module('openolitor-core')
  .factory('FileUtil', function($document, $timeout, $http, API_URL) {

    var openFile = function(filename, arraybuffer, contentType, charset) {
      var defCharset = charset || 'utf-8';
      var defContentType = contentType || '*';
      var blob = new Blob([arraybuffer], {
        type: defContentType + ';charset=' + defCharset + ';'
      });

      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var regex = /filename[^;=\n]*=((['"])(.*?)\2|[^;\n]*)/;
        var results = regex.exec(filename);
        if (results && results.length > 0) {
          if (results.length > 3 && results[3]) {
            filename = results[3];
          } else if (results.length > 1 && results[1]) {
            filename = results[1];
          }
        }

        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', filename);
        downloadLink.attr('target', '_blank');

        $document.find('body').append(downloadLink);
        $timeout(function() {
          downloadLink[0].click();
          downloadLink.remove();
        }, null);
      }
    };

    var download = function(method, url, data, defaultFileName,
      defaultContentType, callback) {
      $http({
        method: method,
        url: API_URL + url,
        data: data,
        responseType: 'arraybuffer'
      }).then(function(res) {
        var name = res.headers('Content-Disposition');
        var contentType = res.headers('Content-Type');
        openFile(name || defaultFileName, res.data,
          contentType || defaultContentType);
        if (callback) {
          callback(res);
        }
      });
    };

    return {
      open: openFile,
      downloadGet: function(url, defaultFileName, defaultContentType,
        callback) {
        return download('GET', url, {}, defaultFileName,
          defaultContentType,
          callback);
      },
      downloadPost: function(url, data, defaultFileName, defaultContentType,
        callback) {
        return download('POST', url, data, defaultFileName,
          defaultContentType, callback);
      }
    };
  });

'use strict';

angular.module('openolitor-core')
  .factory('FilterQueryUtil', function() {
    var regex = /(\w+?)\s*(<=|>=|!=|=|<|>)\s*(.+?)\s*(;| |$)/g;
    var dateRegex = /(\d{2})\.(\d{2})\.(\d{4})/g;

    function replaceValue(input) {
      var result = '';
      var found;

      result = input.replace(dateRegex, function(match, day, month, year) {
        return year + '-' + month + '-' + day;
      });

      return result;
    }

    return {
      transform: function(input) {
        var result = '';
        var found;

        while ((found = regex.exec(input)) !== null) {
          var attribute = found[1];
          var operator = found[2];
          var value = replaceValue(found[3]);

          var operatorFunction = operator
            .replace('>=', '=~gte')
            .replace('<=', '=~lte')
            .replace('>', '=~gt')
            .replace('<', '=~lt')
            .replace('!=', '=~!');

          if(operatorFunction !== operator) {
            result = result.concat(attribute, operatorFunction + '(' + value + ')' + ';');
          } else {
            result = result.concat(attribute, operatorFunction, value + ';');
          }
        }

        return result;
      },

      withoutFilters: function(input) {
        var result = '';
        result = input.replace(regex, '');
        result = result.trim();
        return result;
      }
    };
  });

'use strict';

angular.module('openolitor-core')
  .factory('OverviewCheckboxUtil', function() {
    var checkboxWatchCallback = function($scope, value) {
      if(angular.isUndefined($scope.filteredEntries)) {
        angular.forEach($scope.entries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      } else {
        angular.forEach($scope.filteredEntries, function(item) {
          $scope.checkboxes.items[item.id] = value;
        });
      }

    };

    var dataCheckboxWatchCallback = function($scope) {
      var checked = 0,
        unchecked = 0,
        total = $scope.filteredEntries.length;
      $scope.checkboxes.ids = [];
      $scope.checkboxes.checkedItems = [];
      if (!$scope.checkboxes.data) {
        $scope.checkboxes.data = {};
      }
      angular.forEach($scope.filteredEntries, function(item) {
        checked += ($scope.checkboxes.items[item.id]) || 0;
        unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        if ($scope.checkboxes.items[item.id]) {
          $scope.checkboxes.ids.push(item.id);
          $scope.checkboxes.checkedItems.push(item);
        }
        $scope.checkboxes.data[item.id] = item;
      });
      if ((unchecked === 0) || (checked === 0)) {
        $scope.checkboxes.checked = (checked === total) && checked > 0;
        $scope.checkboxes.checkedAny = (checked > 0);
      }
      // grayed checkbox
      else if ((checked !== 0 && unchecked !== 0)) {
        $scope.checkboxes.css = 'select-all:indeterminate';
        $scope.checkboxes.checkedAny = true;
      } else {
        $scope.checkboxes.css = 'select-all';
        $scope.checkboxes.checkedAny = true;
      }
    };

    return {
      checkboxWatchCallback: checkboxWatchCallback,
      dataCheckboxWatchCallback: dataCheckboxWatchCallback
    };
  });

'use strict';

angular.module('openolitor-core')
  .factory('GeschaeftsjahrUtil', function() {
    /*
    * Der Moment beschreibt den Start des Geschäftsjahrs. Dieses dauert dann ein Jahr lang.
    */
    function Geschaeftsjahr(monat, tag, jahr) {
      /**
       * Errechnet den Start des Geschäftsjahres aufgrund eines Datums
       */
      this.start = function(date) {
        if(angular.isUndefined) {
          date = new Date();
        }
        var geschaftsjahrInJahr = new Date(date.getFullYear(), monat, tag, 0, 0, 0, 0);
        if(date < geschaftsjahrInJahr) {
            //Wir sind noch im "alten" Geschäftsjahr
            geschaftsjahrInJahr.setFullYear(geschaftsjahrInJahr.getFullYear() - 1);
            return geschaftsjahrInJahr;
        } else {
            //Wir sind bereits im neuen Geschäftsjahr
            return geschaftsjahrInJahr;
        }
      };

      /**
       * Errechnet der Key für ein Geschäftsjahr aufgrund eines Datum. Der Key des Geschäftsjahres leitet sich aus dem Startdatum
       * des Geschäftsjahres ab. Wird der Start des Geschäftsjahres auf den Start des Kalenderjahres gesetzt, wird das Kalenderjahr als
       * key benutzt, ansonsten setzt sich der Key aus Monat/Jahr zusammen
       */
      this.key = function(date) {
        if(angular.isUndefined) {
          date = new Date();
        }
        var startDate = this.start(date);
        if (monat === 1 && tag === 1) {
          return startDate.getFullYear();
        } else {
          return (startDate.getMonth() + 1) + '/' + startDate.getFullYear;
        }
      };

      this.isIn = function(date) {
        var usedJahr = jahr;
        if(angular.isUndefined(usedJahr)) {
          //using this year
          usedJahr = new Date().getFullYear();
        }
        var usedTag = tag;
        if(angular.isUndefined(usedTag)) {
          usedTag = 1;
        }
        var gjStart = new Date(usedJahr, monat - 1, usedTag);
        var gjEnd = new Date(usedJahr + 1, monat - 1, usedTag);
        return date > gjStart && date < gjEnd;

      };

      this.isInOrLater = function(date) {
        var usedJahr = jahr;
        if(angular.isUndefined(usedJahr)) {
          //using this year
          usedJahr = new Date().getFullYear();
        }
        var usedTag = tag;
        if(angular.isUndefined(usedTag)) {
          usedTag = 1;
        }
        var gjStart = new Date(usedJahr, monat - 1, usedTag);
        return date > gjStart;

      };
    }

    var isInCurrentGJ = function(projekt, date) {
      return new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).isIn(date);
    };

    var isInCurrentOrLaterGJ = function(projekt, date) {
      return new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).isInOrLater(date);
    };

    var getMatchingGJItem = function(array, projekt, date) {
      if(angular.isUndefined(date)) {
        date = new Date();
      }
      var matchingElement;
      angular.forEach(array, function(value) {
        if(!angular.isUndefined(value.key) && value.key.indexOf('/') !== -1) {
          var elem = value.key.split('/');
          var gj = new Geschaeftsjahr(elem[0], 1, elem[1]);
          if(gj.isIn(date)) {
            matchingElement = value;
          }
        } else {
          var gj2 = new Geschaeftsjahr(1, 1, value.key);
          if(gj2.isIn(date)) {
            matchingElement = value;
          }
        }
      });
      if(angular.isUndefined(matchingElement) && !angular.isUndefined(projekt)) {
        matchingElement = {
          key: new Geschaeftsjahr(projekt.geschaeftsjahrMonat, projekt.geschaeftsjahrTag).key(date),
          value: 0
        };
      }
      return matchingElement;
    };

    var setOnMatchingGJItem = function(array, val2set, date) {
      var match = getMatchingGJItem(array, date);
      if(!angular.isUndefined(match)) {
        match.value = val2set;
      }
    };

    return {
      isInCurrentGJ: isInCurrentGJ,
      isInCurrentOrLaterGJ: isInCurrentOrLaterGJ,
      getMatchingGJItem: getMatchingGJItem,
      setOnMatchingGJItem: setOnMatchingGJItem
    };
  });

'use strict';

angular.module('openolitor-core')
  .factory('ooClientMessageService', ['$http', '$location', '$q', '$interval',
    '$rootScope', '$log',
    'msgBus', 'API_WS_URL', 'BUILD_NR', 'ooAuthService',
    function($http, $location, $q, $interval, $rootScope, $log, msgBus,
      API_WS_URL, BUILD_NR, ooAuthService) {

      var send = function(eventType, eventData) {
        // append type to event data
        var obj = JSON.stringify(eventData);
        var data = (obj) ? (',' + obj.substring(1)) : '';
        var event = '{"type":"' + eventType + '"' + data + '}';
        try {
          $log.debug('sending message: ' + event);
          $rootScope.messagingSocket.send(event);
        } catch (err) {
          $log.error('error sending message: i' + err);
        }
      };

      var reconnectPromise;
      var scheduler;

      var openWebSocket = function(url) {
        var ws = new WebSocket(url);

        ws.onmessage = function(msg) {
          var data = convertDateStringsToDates(JSON.parse(msg.data));
          console.log('WS received event', data);
          msgBus.emitMsg(data);
        };
        ws.onopen = function(event) {
          console.log('WS onopen : ' + event);
          //send hello command to server
          send('HelloServer', {
            client: 'angularClient_' + BUILD_NR
          });

          if (!angular.isUndefined(scheduler)) {
            $interval.cancel(scheduler);
            scheduler = undefined;
          }
          scheduler = $interval(function() {
            var t = new Date().getTime();
            send('ClientPing', {
              time: t
            });
          }, 90000);

          if (!angular.isUndefined(reconnectPromise)) {
            $interval.cancel(reconnectPromise);
            reconnectPromise = undefined;
            msgBus.emitMsg({
              type: 'WebSocketOpen'
            });
          }

          $rootScope.$watch(function() {
            return ooAuthService.getToken();
          }, function(token) {
            $log.debug('Token changed, login/logout to websocket',
              token);
            if (token) {
              //login to websocket as well
              send('Login', {
                token: token
              });
            } else {
              // logout
              send('Logout');
            }
          });
        };
        ws.onclose = function(event) {
          var reason;
          // See http://tools.ietf.org/html/rfc6455#section-7.4.1
          if (event.code === 1000) {
            reason =
              'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
          } else if (event.code === 1001) {
            reason =
              'An endpoint is \'going away\', such as a server going down or a browser having navigated away from a page.';
          } else if (event.code === 1002) {
            reason =
              'An endpoint is terminating the connection due to a protocol error';
          } else if (event.code === 1003) {
            reason =
              'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
          } else if (event.code === 1004) {
            reason =
              'Reserved. The specific meaning might be defined in the future.';
          } else if (event.code === 1005) {
            reason = 'No status code was actually present.';
          } else if (event.code === 1006) {
            reason =
              'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
          } else if (event.code === 1007) {
            reason =
              'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
          } else if (event.code === 1008) {
            reason =
              'An endpoint is terminating the connection because it has received a message that \'violates its policy\'. This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
          } else if (event.code === 1009) {
            reason =
              'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
          } else if (event.code === 1010) { // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            reason =
              'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' +
              event.reason;
          } else if (event.code === 1011) {
            reason =
              'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
          } else if (event.code === 1015) {
            reason =
              'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
          } else {
            reason = 'Unknown reason';
          }
          $log.debug('WS closed with a reason:' + reason, event, new Date());
          msgBus.emitMsg({
            type: 'WebSocketClosed',
            reason: reason
          });

          //retry opening WebSocket every 5 seconds
          if (angular.isUndefined(reconnectPromise)) {
            reconnectPromise = $interval(function() {
              $rootScope.messagingSocket = openWebSocket(url);
            }, 5000);
          }
        };
        return ws;
      };

      return {
        //send message to server
        send: send,
        //start websocket based messaging
        start: function() {
          $log.debug('registering websocket, request websocket url');
          var wsUrl = API_WS_URL.replace('http://', 'ws://').replace(
            'https://', 'wss://');
          $log.debug('registering websocket, bind to ' + wsUrl);
          //append token to websocket url because normal http headers can't get controlled
          var securedUrl = wsUrl; //+ '?auth='+userService.getToken();
          if (!(angular.isDefined($rootScope.messagingSocket)) && wsUrl.substring(
              0, 2) !== '@@') {
            $rootScope.messagingSocket = openWebSocket(securedUrl);
          }
        }
      };
    }
  ]);

  'use strict';

  angular.module('openolitor-core').factory('alertService', ['$injector',
    function($injector) {

      var $rootScope = $injector.get('$rootScope');
      var $timeout = $injector.get('$timeout');

      function checkAlerts(targetScope) {
        if (!targetScope.alerts) {
          targetScope.alerts = [];
        }
      }

      return {
        /**
         * Add an alert to the global scope using type (error, lighterror, info, warning)
         */
        addAlert: function(type, msg, details) {
          var message = {
            'type': type,
            'msg': msg,
            'details': details
          };

          checkAlerts($rootScope);

          $rootScope.alerts.push(message);

          // If it's an info message, automatically remove the element after 1 second.
          if (type === 'info' || type === 'lighterror') {
            var displayTime = (type === 'info') ? 1000 : 3000;
            $timeout(function() {
              var index = $rootScope.alerts.indexOf(message);

              if (index > -1) {
                $rootScope.alerts.splice(index, 1);
              }
            }, displayTime, true);
          }
        },

        removeAllAlerts: function() {
          $rootScope.alerts = [];
        },

        removeAlert: function() {
          return function(index) {
            checkAlerts($rootScope);
            $rootScope.alerts.splice(index, 1);
          };
        }
      };
    }
  ]);

  'use strict';

  /**
   * If the current route does not resolve, go back to the start page.
   */
  var checkAuth = function($q, ooAuthService, $rootScope, $location, $log) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      return ooAuthService.authorize(next.access).then(function(
        authorized) {
        $log.debug('check authorization:' + next.access + ' -> ' +
          authorized);
        if (!authorized) {
          ooAuthService.isLoggedIn().then(function(loggedIn) {
            if (loggedIn) {
              $location.path('/forbidden');
            } else {
              $location.path('/login');
            }
          });
        }
      });
    });
  };
  checkAuth.$inject = ['$q', 'ooAuthService', '$rootScope', '$location', '$log'];

  angular.module('openolitor-core').factory('ooAuthService', ['$http', '$location',
      '$q', '$cookies', '$log', 'API_URL',
      function($http, $location, $q, $cookies, $log, API_URL) {
        var user, token = $cookies.get('XSRF-TOKEN');

        var currentUser = function() {
          return $http.get(API_URL + 'auth/user').then(function(response) {
            user = response.data;
            $log.debug('Login succeeded:' + user);
            return user;
          });
        };

        var resolveUser = function() {
          /* If the token is assigned, check that the token is still valid on the server */
          var deferred = $q.defer();
          if (user) {
            deferred.resolve(user);
          } else if (token) {
            $log.debug('Restoring user from cookie...');
            currentUser()
              .then(function(u) {
                user = u;
                deferred.resolve(u);
              }, function() {
                $log.debug('Token no longer valid, please log in.');
                token = undefined;
                $cookies.remove('XSRF-TOKEN');
                deferred.reject('Token invalid');
              });
          } else {
            user = {
              id: '',
              rolle: 'Guest'
            };
            deferred.resolve(user);
          }

          return deferred.promise;
        };



        return {
          loggedIn: function(tkn) {
            $cookies.put('XSRF-TOKEN', tkn);
            $log.debug('logged in', tkn);
            return currentUser().then(function(usr) {
              $log.debug('resolved user after login', usr);
              user = usr;
              token = tkn;
              return usr;
            });
          },
          loggedOut: function() {
            // Logout on server in a real app
            $cookies.remove('XSRF-TOKEN');
            token = undefined;
            user = undefined;
            $location.$$search = {}; // clear token & token signature
            $log.debug('Good bye');
          },
          resolveUser: resolveUser,
          getUser: function() {
            return user;
          },
          getToken: function() {
            return token;
          },
          authorize: function(accessLevel) {
            return resolveUser().then(function(user) {
              $log.debug('authorize:', accessLevel + ' => ' + user.rolle);
              return accessLevel === undefined || accessLevel ===
                userRoles.Guest || accessLevel === user.rolle ||
                Array.isArray(accessLevel) && (accessLevel.indexOf(userRoles.Guest) > -1 || accessLevel.indexOf(user.rolle) > -1);
            });
          },
          isLoggedIn: function() {
            return resolveUser().then(function(user) {
              return user.rolle !== userRoles.Guest;
            });
          },
          isUserLoggedIn: function(user) {
            if (user === undefined) {
              return false;
            }
            return user.rolle !== userRoles.Guest;
          }
        };
      }
    ])
    .factory('requestSecurityInjector', ['$cookies', 'moment', '$log', function(
      $cookies, moment, $log) {
      return {
        request: function(config) {
          var token = $cookies.get('XSRF-TOKEN');

          if (token) {
            //add enhanced token to request header
            var enhancedToken = token + '::' + moment().toISOString();
            config.headers['XSRF-TOKEN'] = enhancedToken;
          }

          return config;
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('requestSecurityInjector');
      // enable send cookies with requests
      $httpProvider.defaults.withCredentials = true;
    }])
    .run(checkAuth);

  'use strict';

  angular.module('openolitor-core').factory('dialogService', ['$uibModal', function($uibModal) {

    return {
      displayDialogOkAbort: function(msg, okFct) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/common/components/oo-dialogokabort.directive.modal.html',
          controller: 'ooDialogOkAbortModalInstanceCtrl',
          resolve: {
            message: function() {
              return msg;
            }
          }
        });

        modalInstance.result.then(okFct);
      }

    };
  }]);

'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('NgTableExportController', ['$scope', '$element', 'exportTable', 'FileSaver',
    function($scope, $element, exportTable, FileSaver) {
      $scope.showExport = false;
      var fileName = 'Export';
      if(angular.isDefined($element.parent().parent().parent().parent())) {
        fileName = $element.parent().parent().parent().parent().attr('export-file-name');
        $scope.showExport = $element.parent().parent().parent().parent().attr('display-export');
      }
      $scope.exportData = function() {
        var filter = { };
        if(angular.isDefined($element.parent().parent().parent().scope().params.settings().exportODSFilter)) {
          filter = $element.parent().parent().parent().scope().params.settings().exportODSFilter();
        }
        $element.parent().parent().parent().scope().params.settings().exportODSModel.exportODS(
          filter,
          filter,
          function(file) {
            FileSaver.saveAs(file.response, fileName + '.ods');
          }
        );
      };

    }
  ]
);

'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('NgTableCountController', ['$scope', '$cookies',
    function($scope, $cookies) {

      var deepFind = function(obj, path) {
        var paths = path.split('.'),
          current = obj,
          i;

        for (i = 0; i < paths.length; ++i) {
          if (current[paths[i]] === undefined) {
            return undefined;
          } else {
            current = current[paths[i]];
          }
        }
        return current;
      };

      var setCookie = function(count) {
        $cookies.put('ngTableCount', count);
      };

      var getCookie = function() {
        var r = $cookies.get('ngTableCount');
        if(angular.isUndefined(r)) {
          r = 25;
        }
        return r;
      };

      $scope.count = function(count) {
        deepFind($scope.$parent, 'params').count(count);
        setCookie(count);
      };

      $scope.fetchStoredCount = function() {
        return getCookie();
      };

      deepFind($scope.$parent, 'params').count($scope.fetchStoredCount());
    }
  ]
);

'use strict';

angular.module('openolitor-core').directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 50);
        }
    };
});

'use strict';

angular.module('openolitor-core').directive('httpSrc', function($http) {
  return {
    restrict: 'A',
    link: function(_scope, _element, attrs) {
      var requestConfig = {
        method: 'GET',
        responseType: 'arraybuffer',
        cache: 'true'
      };

      function base64Img(data) {
        var arr = new Uint8Array(data);
        var raw = '';
        var i, j, subArray, chunk = 5000;
        for (i = 0, j = arr.length; i < j; i += chunk) {
          subArray = arr.subarray(i, i + chunk);
          raw += String.fromCharCode.apply(null, subArray);
        }
        return btoa(raw);
      }

      attrs.$observe('httpSrc', function(srcUrl) {
        if (srcUrl) {
          requestConfig.url = srcUrl;
          $http(requestConfig)
            .then(function(response) {
              attrs.$set('src', 'data:image/jpeg;base64,' + base64Img(response.data));
            });
        }
      });
    }
  };
});

'use strict';

angular.module('openolitor-core').directive('localdate', function(moment) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(_scope, _element, _attr, _ngModel) {
      function from(input) {
        if (input) {
          // a temorary solution. there will be a time zone setting for the project in the future.
          var result = new Date(input.getTime() - input.getTimezoneOffset() * 60 * 1000);
          return result;
        }
        return input;
      }

      _ngModel.$parsers.unshift(from);
    }
  };
});

'use strict';

/**
 */
angular.module('openolitor-core')
  .controller('LoginController', ['$scope', '$rootScope', '$http',
    'API_URL', 'ENV', 'gettext', '$rootElement',
    'alertService', '$timeout', '$location', '$route', '$routeParams', 'ooAuthService', '$interval',
    function($scope, $rootScope, $http, API_URL, ENV, gettext, $rootElement,
      alertService, $timeout, $location, $route, $routeParams, ooAuthService, $interval) {
      $scope.loginData = {};
      $scope.resetPasswordData = {};
      $scope.secondFactorData = {};
      $scope.changePwd = {
        neu: undefined,
        alt: undefined,
        neuConfirmed: undefined
      };
      $scope.initPassword = {
        neu: undefined,
        neuConfirmed: undefined,
        token: undefined
      };
      $scope.status = 'login';
      $scope.env = ENV;
      $scope.secondFactorCountdown = 600;
      $scope.secondFactorCountdownDate = function() {
        return moment().add($scope.secondFactorCountdown, 'seconds');
      };

      $scope.originalTgState = $rootScope.tgState;
      $rootScope.tgState = false;

      var showWelcomeMessage = function(token, person) {
        //show welcome message
        alertService.addAlert('info', gettext('Willkommen') + ' ' +
          person.vorname + ' ' +
          person.name);
        $timeout(function() {
          $location.path('/');
          $scope.status = 'login';
          $rootScope.tgState = $scope.originalTgState;
        }, 1000);

        ooAuthService.loggedIn(token);
      };

      var showGoodbyeMessage = function(usr) {
        if(!angular.isUndefined(usr)) {
          alertService.addAlert('info', gettext('Aufwiedersehen') + ' ' +
            usr.vorname + ' ' +
            usr.name);
        }
      };

      $scope.appName = $rootElement.attr('ng-app');

      var doLogout = function(showMessage, msg) {
        var usr = ooAuthService.getUser();
        $http.post(API_URL + 'auth/logout').then(function() {
          $scope.loginData.message = undefined;

          ooAuthService.loggedOut();
          if (showMessage) {
            showGoodbyeMessage(usr);
          }

          $timeout(function() {
            $scope.status = 'login';
            if (msg && msg !== '') {
              $location.path('/login').search('msg', msg);
            } else {
              $location.path('/login');
            }
          }, 1000);
        });
      };

      var showPasswordChangedMessage = function() {
        //show welcome message
        alertService.addAlert('info', gettext(
          'Passwort wurde erfolgreich geändert, Sie werden automatisch ausgelogged.'
        ));

        doLogout(false, gettext(
          'Passwort wurde erfolgreich geändert, Sie wurden automatisch ausgelogged. Bitte loggen Sie sich mit dem neuen Passwort erneut an.'
        ));
      };

      var showPasswordSetMessage = function() {
        alertService.addAlert('info', gettext(
          'Das Passwort wurde erfolgreich gesetzt. Sie können sich nun anmelden.'
        ));

        $timeout(function() {
          $location.path('/login');
        }, 1000);
      };

      var showPasswordResetMessage = function() {
        alertService.addAlert('info', gettext(
          'Anweisungen um Ihr Passwort neu zu setzten wurden Ihnen an Ihre Email-Adresse gesendet.'
        ));

        $timeout(function() {
          $location.path('/');
        }, 1000);
      };

      var logout = $route.current.$$route.logout;
      if (logout) {
        doLogout(true);
      }
      var msg = $routeParams.msg;
      if (msg && msg !== '') {
        $scope.loginData.message = msg;
      }

      $scope.login = function() {
        if ($scope.loginForm.$valid) {
          $http.post(API_URL + 'auth/login', $scope.loginData).then(
            function(
              result) {
              $scope.loginData.message = undefined;

              //check result
              if (result.data.status === 'LoginSecondFactorRequired') {
                //redirect to second factor authentication
                $scope.status = 'twoFactor';
                $scope.person = result.data.person;
                $scope.secondFactorData.token = result.data.token;

                $scope.cancelSecondFactorTimer = $interval(function() {
                  $scope.secondFactorCountdown--;
                  if($scope.secondFactorCountdown === 0) {
                    $interval.cancel($scope.cancelSecondFactorTimer);
                    $scope.resetForm();
                  }
                }, 1000, 0);
              } else {
                showWelcomeMessage(result.data.token, result.data.person);
              }
            },
            function(error) {
              $scope.loginData.message = gettext(error.data);
            });
        }
      };

      $scope.secondFactorLogin = function() {
        if ($scope.secondFactorForm.$valid) {
          $http.post(API_URL + 'auth/secondFactor', $scope.secondFactorData)
            .then(function(
              result) {
              $scope.secondFactorData.message = undefined;
              if ($scope.cancelSecondFactorTimer) {
                $interval.cancel($scope.cancelSecondFactorTimer);
              }
              showWelcomeMessage(result.data.token, result.data.person);
            }, function(error) {
              $scope.secondFactorData.message = gettext(error.data);
            });
        }
      };

      $scope.changePassword = function() {
        if ($scope.changePwdForm.$valid) {
          $http.post(API_URL + 'auth/passwd', $scope.changePwd)
            .then(function() {
              $scope.changePwd.message = undefined;
              showPasswordChangedMessage();
            }, function(error) {
              $scope.changePwd.message = gettext(error.data);
            });
        }
      };

      $scope.setPassword = function() {
        if ($scope.setPasswordForm.$valid) {
          $scope.initPassword.token = $routeParams.token;
          $http.post(API_URL + 'auth/zugangaktivieren', $scope.initPassword)
            .then(function() {
              $scope.initPassword.message = undefined;
              showPasswordSetMessage();
            }, function(error) {
              $scope.initPassword.message = gettext(error.data);
            });
        }
      };

      $scope.resetPassword = function() {
        if ($scope.resetPasswordForm.$valid) {
          $http.post(API_URL + 'auth/passwordreset', $scope.resetPasswordData).then(
            function() {
              $scope.resetPasswordData.message = undefined;
              showPasswordResetMessage();
            },
            function(error) {
              $scope.resetPasswordData.message = gettext(error.data);
            });
        }
      };

      $scope.resetForm = function() {
        $scope.loginData = {};
        $scope.status = 'login';
      };
    }
  ]);

'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('ServerModel', function($resource, API_URL) {
    return $resource(API_URL + 'status/staticInfo/', { },
      {'query': {method:'GET', isArray: false}});
  });

'use strict';

/**
 */
angular.module('openolitor-core')
  .factory('ServerService', ['$rootScope', 'ServerModel',
    function($rootScope, ServerModel) {

      var staticServerInfo;

      var load = function() {
        ServerModel.query({}, function(result) {
          staticServerInfo = result;
        });
      };
      load();

      return {
        getStaticServerInfo: function() {
          return staticServerInfo;
        }
      };
    }
  ]);

angular.module('openolitor-core').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en', {"#":"#","# Lieferungen bisher:":"# Deliveries so far:","%":"%","+41 ...":"+41 ...","+41 7...":"+41 7...","+41...":"+41 ...","$":"$","£":"£","€":"€","2.0":"2.0","Abbrechen":"Quit","Abo":"Subscription","Abo erstellen":"Create subscription","Abo erstellen für {{kunde.bezeichnung}}":"Create a subscription for {{}} kunde.bezeichnung","Abo für":"subscription for","Abos":"Subscriptions","Abotyp":"subscription type","Abotyp ' + abotyp.name || 'Abotyp":"Subscription type '  abotyp.name || 'subscription type","Abotyp erstellen":"Create a subscription type","Abotyp hinzufügen:":"Add subscription type:","Abotypen":"Subscription types","Abweichende Lieferadresse":"Differing Delivery Address","Abwesenheiten":"Abscenses","Administrations-Anteil":"Administration Share","Administrationsumgebung für":"Administration platform","Adresse":"Address","Adresszusatz":"Extra address line","Aktion  für  konnte nicht ausgeführt werden. Fehler:":"This action could not be executed. Error:","Aktiv":"Active","Aktuell":"Current","alle":"all","Alle Spalten einblenden":"Show all columns","Alternative E-Mail-Adresse":"Alternate Email Address","Anprechperson":"contact person","Anrede":"Title","Anschrift":"Designation","Anschrift oder Bezeichnung":"Designation","Ansprechperson hinzufügen":"Add contact person","Anzahl":"Quantity","Anzahl aktive Abonnemente":"Number of active subscriptions","Anzahl Lieferungen":"# Deliveries so far:","Anzahl Soll-Abwesenheiten":"Number of targeted absences","Apr":"Apr","April":"April","Aug":"Aug","August":"August","Ausstehend":"not paid","Bank":"Bank","Bank, PLZ Ort":"Bank, Postcode City","Basisdaten":"Basic data","Bearbeitet":"Processed","Bearbeitet:":"Processed:","Bemerkungen":"Remarks","Bemerkungen zu diesem Produzenten":"Remarks concerning this producer","Bemerkungen zu dieser Person":"Remarks concerning this person","Beschreibung":"Description","Betrag":"Amount","bezahlt":"paid","Bezahlt":"Paid","Bezeichnung":"Designation","bis":"until","Bis":"to","Bitte wählen...":"Please select...","Britisches Pfund":"UK Pound","Bu.":"Acc.","Buchhaltung":"Accounting","Bund":"Bunch","CAD":"CAD","CH...":"CH","CHE-xxx.yyy.zzz MWST":"CHE xxx.yyy.zzz VAT","CHF":"CHF","Dateien":"Files","Depot":"Depot","Depot erstellen":"Create Depot","Depot:":"Depot:","Depotlieferung":"Depot Delivery","DepotlieferungAbo":"Depot DeliverySuscription","Depotname":"Depot name","Depots":"depots","Dez":"Dec","Dezember":"December","DI":"TUES","Dienstag":"Tuesday","Diese Seite konnte nicht gefunden werden!":"The page cannot be found","Dieser Abotyp ist derzeit nicht aktiv":"This subscription type is not currently active","DO":"THURS","Donnerstag":"Thursday","E-Mail":"Email","Einbezahlter Betrag":"amount paid","Eindeutige Bezeichnung":"unique name","Eine manuelle Rechnung für":"A manual invoice for","Eingangsdatum":"Receipt of payment","Einkauf*":"Purchase","Einstellungen":"Settings","Einstellungen editieren":"edit settings","Email":"Email","Email alt.":"Other Email","Erledigt":"Done","Error 404":"Error 404","erstellen":"create","Erstellen":"Create","Erstellt":"Created","Erstellt:":"Created:","ESR":"ESR","Etage, Hinterlegung, ...":"Floor, deposit, ...","Euro":"Euros","Fälligkeitsdatum":"Date due","Farbe-Code":"Color Code","Feb":"Feb","Februar":"February","FR":"FRI","Frau":"Mrs.","Freitag":"Friday","Für Anzahl Lieferungen":"For number of deliveries","Geplante Lieferdaten":"Planned Delivery Dates","gr":"gr","Gramm":"Gram","Guthaben":"Credit balance","Guthaben Mindestbestand":"Credit balance minimum","Heimlieferung":"Home Delivery","HeimlieferungAbo":"Home Delivery subscription","Herr":"Mr","IBAN":"IBAN","Inaktiv":"Inactive","InBearbeitung":"In Progress","Ja":"Yes","Jan":"Jan","Januar":"January","Jul":"July","Juli":"July","Jun":"June","Juni":"June","Kanadischer Dollar":"Canadian Dollar","Keine Kunden":"No customers","kg":"kg","Kilogramm":"kilograms","Konfigurationen":"Configurations","konnte nicht gelöscht werden. Fehler:":"could not be deleted. Error:","konnte nicht gespeichert werden. Fehler:":"could not be saved. Error:","Kontaktdaten":"Contact Information","Kontodaten":"Account data","KRZ":"ACR","Kunde":"Participant","Kunde erstellen":"Create a participant","Kunde Nr.":"No participant","Kunden":"Participants","Kunden E-Mail erforderlich":"Participant Email required","Kundentyp":"Participant type","Kundentyp Name...":"Participant type Name...","Kundentypen":"Participant Types","Kurzzeichen":"Acronym","Laufzeit":"Contract period","Letzte Lieferung":"Last delivery","Lieferdaten erstellen":"Create Delivery Dates","Lieferdaten generieren":"generate delivery data","Lieferdatum":"Delivery date","Lieferplanungen":"delivery planning","Lieferrhythmus":"delivery frequency","Liefertag":"Delivery day","Lieferung":"Delivery","Lieferung vom":"Delivery of","Lieferungen":"Deliveries","Logo":"Logo","Logo auswählen oder einfügen":"Select or insert Logo","Löschen":"Delete","MahnungVerschickt":"reminder Sent","Mai":"May","Mar":"Mar","März":"March","Maximal Abos pro Liefertag":"Maximum baskets per delivery day","Menge":"Quantity","Menge / Einheit":"Quantity/unit","Menge Total":"Total amount","MI":"WED","Mittwoch":"Wednesday","MO":"MON","Monate":"months","Monatlich":"Monthly","Montag":"Monday","MWST":"VAT","MWST-Nr":"VAT No.","MWST-Pflicht":"VAT liability","MWST-Satz":"VAT rate","Name":"Name","Name / Betrieb":"Name / farm","Name oder Betriebsbezeichnung":"Name or company name","Name oder Bezeichnung":"Name or designation","Nein":"No","Neu":"New","Neue Bezeichnung":"New designation","Neue Lieferplanung generieren":"Generate New Delivery Planning","Neue Pendenz":"New open issue","Neues Abo":"new subscription","NichtErledigt":"Not done","Nov":"Nov","November":"November","Nr":"No.","Offen":"open","Öffnungszeiten":"Opening hours","Okt":"Oct","Oktober":"October","Ort":"City","pendente":"pending","Pendenzen":"Open Issues","Pendenzen / History":"Open Issues / history","Planung":"Planning","Planung #{{planung.nr}}: Korbinhalt":"Planning # {{}} planung.nr: Basket content","Planung #{{planung.nr}}: Zusammenzug Lieferanten":"Planning # {{}} planung.nr: alle producers","Planung abschliessen":"finish planning","PLZ":"Post Code","PLZ / Ort":"Postal code/City","Postfach, c/o, ...":"Mailbox, c / o ...","Postfach, Etage, c/o, ...":"Mailbox, Floor, c / o ...","Postlieferung":"post Delivery","PostlieferungAbo":"Post Delivery Subscription","Preis":"Price","Preis / Einheit":"Price/ Unit","Preis / Packung":"Price / pack","Preise editierbar":"Prices editable","Preise sichtbar / relevant":"Prices visible / relevant","pro":"per","pro Lieferung":"per delivery","Produkt":"Product","Produkt erstellen":"Create a product","Produktbez.":"Product des.","Produkte":"Products","Produkte-Angebot":"Products in the list","Produktekategorie Name...":"Product Category name ...","Produktekategorien":"Product Categories","Produzent":"Producer","Produzent erstellen":"Create producer","Produzenten":"Producers","Produzenten-Übersicht":"List of producers","Projekt":"Project","Projekteinstellungen":"Project Settings","Rechnung":"Invoice","Rechnung erstellen":"Generate invoice","Rechnungen":"Invoices","Rechnungsadresse":"Invoicing address","Rechnungsdaten":"Billing details","Rechnungsdatum":"Invoice date","Referenznummer":"Reference No.","Reports*":"Reports","SA":"SA","Samstag":"Saturday","Satz":"Rate","Schweizer Franken":"Swiss Franc","Sep":"Sept","September":"September","Sind Sie sicher?":"Are you sure?","SO":"SUN","Soll der Löschvorgang fortgesetzt werden?":"Is the deleting operation to be continued?","Sonntag":"Sunday","speichern":"Save","Speichern":"Save","St.":"piece","Stammdaten":"Basic data","Start":"Start","Start des Geschäftsjahres":"Start of the accounting year","Status":"Status","Storniert":"Cancelled","Strasse":"Street","Strasse / Nr.":"Street/no.","Stück":"Piece","Suche in Übersicht...":"Search in overview","Summe":"Total","Telefon":"Telephone","Telefon Festnetz":"Telephone, landline","Telefon Mobil":"Telephone, mobile/cell","Text...":"Text...","Titel":"Title","total":"total","Total":"Total","Total (inkl. MWST)":"Total inc. VAT","Total über alle Lieferungen":"Total of all deliveries","Total über alle Lieferungen (inkl. MWST)":"Total of all deliveries (incl. VAT)","Tour":"Tour","Tour erstellen":"Create Tour","Tour:":"Tour:","Touren":"Tours","Übersicht der Körbe":"List of all baskets","Unbeschraenkt":"Unlimited","Unregelmaessig":"Irregular","US Dollar":"US Dollar","Verantwortliche Person":"Responsible person","verrechnet":"invoiced","Verschickt":"Sent","Vertraglich":"contractual","Vertriebsart":"Distribution type","Vertriebsarten":"Distribution types","Von":"By","Vorlagen*":"Templates","Vorname":"First name","Währung":"Currency","Weitere Aktionen":"Other Actions","Wichtigste Spalten einblenden":"Show Main Columns","Wird standartmässig geplant":"Is planned \tregularly","Woechentlich":"Weekly","wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.":"has been changed by another person. Please refresh the display.","wurde durch eine andere Person gelöscht.":"was deleted by another person.","wurde erfolgreich gelöscht.":"has been successfully deleted.","Zielpreis":"target price","Zusatzdaten":"Additional data","Zusatzinfos":"additional info","Zuviel bezogene Körbe verrechnen":"Create invoice for unpaid baskets ","Zweiwoechentlich":"Fortnightly"});
    gettextCatalog.setStrings('fr_BE', {"Abmelden":"se déconnecter","Das Backend steht im Moment nicht zur Verfügung. Bitte besuchen Sie uns später wieder.":"Le back-end est momentanément ineccessible. Merci de revenir un peu plus tard.","Diese Seite konnte nicht gefunden werden!":"La page demandée n’a pas été trouvée","Eingabe erforderlich":"Champ obligatoir","Eingabe stimmt nicht übereint":"Les données ne correspondent pas","Eingabe zu kurz":"Les données sont trop courtes","Eingage zu lang":"Les données sont trop longues","Einstellungen":"Paramètres","Error 404":"Erreur 404","Fehlerhafte Email Adresse":"adresse e-mail erronné","OpenOlitor Mitgliederportal für":"OpenOlitor portail de membres pour","Passwort wechseln":"Changer mot de passe"});
    gettextCatalog.setStrings('fr_CH', {"- Entwicklungsumgebung":"- Plateforme de développement","- Testumgebung":"- Plateforme de Test","Abbrechen":"Annuler","Abmelden":"Se déloguer","Abos":"Abonnements","Abotypen":"Types d'abonnement","Anmelden":"Se connecter","Anmeldung":"Bonjour","Apr":"Avr","April":"Avril","Aufwiedersehen":"Au revoir","Aug":"Août","August":"Août","Ausstehend":"dû","Bezahlt":"Payé","Britisches Pfund":"Livre sterling","Bu.":"Compt.","Buchhaltung":"Comptabilité","Bund":"Bouquet","CAD":"CAD","CHF":"CHF","DI":"MAR","DO":"JEU","Das Backend steht im Moment nicht zur Verfügung. Bitte besuchen Sie uns später wieder.":"Le serveur n'est actuellement pas à disposition. Veuillez réessayer dans un instant.","Depotlieferung":"Livraison à dépôt","DepotlieferungAbo":"Abonnement livraison à dépôt","Depots":"Dépôts","Dez":"Déc.","Dezember":"Décembre","Die Daten in diesem System werden sporadisch auf die Standardwerte zurückgesetzt.":"Les données sont réinitialisés de temps en temps. ","Dienstag":"Mardi","Diese Seite konnte nicht gefunden werden!":"La page demandée n’a pas été trouvée","Donnerstag":"Jeudi","E-Mail Adresse":"adresse email","E-Mail:":"Adresse email:","Einkauf*":"Commandes","Einstellungen":"Paramètres","Email Adresse":"adresse email","Erledigt":"Clos","Error 404":"Erreur 404","Erstellen":"Créer","Erstellt":"Créé","Euro":"Euro","FR":"FR","Feb":"FEV","Februar":"Février","Frau":"Madame","Freitag":"Vendredi","Für das Testen der Administrationsumgebung, bitte hier klicken!":"Pour tester le système en tant qu'administrateur, cliquez ici!","Für den Zugang auf die Administrationsumgebung von OpenOlitor, bitte den Link unten rechts verwenden.":"Pour accéder en tant qu'administrateur, veuillez utiliser le lien en bas à droit.","Für den Zugriff auf OpenOlitor ist eine Anmeldung erforderlich":"Pour accéder OpenOlitor, veuillez-vous annoncer.","Für den Zugriff auf die Administrationsumgebung ist eine Anmeldung erforderlich":"Pour accéder au système d'administration, veuillez-vous annoncer.","Gramm":"gramme","Heimlieferung":"Livraison à domicile","HeimlieferungAbo":"Abonnement livraison à domicile","Herr":"Monsieur","Ja":"Oui","Jan":"JAN","Januar":"Janvier","Jul":"JUL","Juli":"Juillet","Jun":"Juin","Juni":"Juin","Kanadischer Dollar":"Dollar canadien","Kilogramm":"kilogramme","Kunden":"Participants","Lieferung":"Livraison","Lieferungen":"Livraisons","Löschen":"Supprimer","MI":"ME","MO":"LU","MahnungVerschickt":"Rappel-envoyé","Mai":"Mai","Mar":"Mar","Mittwoch":"Mercredi","Monate":"Mois","Monatlich":"Mensuel","Montag":"Lundi","März":"Mars","Nein":"Non","NichtErledigt":"non achevé","Nov":"Nov","November":"Novembre","Offen":"Ouvert","Ok":"Ok","Okt":"Oct","Oktober":"Octobre","Passwort":"mot de passe","Passwort vergessen?":"Vous avez oublié votre mot de passe?","Passwort:":"Mot de passe:","Pendenzen":"Liste des affaires en suspens","Postlieferung":"Livraison par poste","PostlieferungAbo":"Abonnement de livraison par poste","Produkte":"Produits","Produzenten":"Producteurs","Projekt":"Initiative","Rechnungen":"Factures","Reports*":"Rapports","SA":"SA","SO":"SO","Samstag":"Samedi","Schweizer Franken":"Francs suisses","Sep":"Sep","September":"Septembre","Sie befinden sich auf dem OpenOlitor Testsystem. Sie können sich mit den untenstehenden Anmeldeinformationen als Konsument anmelden:":"Vous vous trouvez sur le système de test de la plateforme OpenOlitor. Avec les données ci-dessous vous pouvez vous connecter en tant que consommateur:","Sie befinden sich auf dem OpenOlitor Testsystem. Sie können sich mit den untenstehenden Anmeldeinformationen an der Administrationsumgebung anmelden:":"Vous vous trouvez sur le système de test de la plateforme OpenOlitor. Avec les données ci-dessous vous pouvez vous connecter en tant que administrateur:","Sind Sie sicher?":"Êtes-vous sûr?","Soll der Löschvorgang fortgesetzt werden?":"Souhaitez-vous poursuivre de supprimer ces données?","Sonntag":"Dimanche","St.":"Pièce","Stammdaten":"Données de base","Storniert":"Annulé","Stück":"Pièce","Touren":"Tours","US Dollar":"US Dollar","Unbeschraenkt":"illimitée","Unregelmaessig":"irrégulièrement","Verschickt":"Envoyé","Vorlagen*":"Modèles*","Weitere Aktionen":"Autres actions","Woechentlich":"Hebdomadaire","Zweiwoechentlich":"Quinzomadaire","erstellen":"créer","gr":"gr","kg":"kg","konnte nicht gelöscht werden. Fehler:":"ne pouvait pas être supprimé. Erreur:","konnte nicht gespeichert werden. Fehler:":"ne pouvait pas être  sauvegardé. Erreur:","pro":"par","speichern":"sauvegarder","wurde durch eine andere Person gelöscht.":"a été supprimé/e par une autre personne.","wurde durch eine andere Person geändert. Bitte laden Sie die Ansicht neu.":"a été supprimé/e par une autre personne, Veuillez actualiser cette page.","wurde erfolgreich gelöscht.":"a été supprimé avec succès."});
/* jshint +W100 */
}]);
angular.module('openolitor-core').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('scripts/common/components/oo-actionsbutton.directive.html',
    "<span><div class=\"btn-group\"><button ng-click=\"execute(actions[0])\" ng-disabled=\"actions[0].isDisabled() || form.$invalid || model.actionInProgress\" type=\"button\" class=\"btn {{ btnStyle }}\"><i class=\"{{ actions[0].iconClass ? actions[0].iconClass : 'fa fa-floppy-o'}}\"></i> <span ng-if=\"!notext && !actions[0].noText && !actions[0].noEntityText\">{{entity | translate}}</span> <span ng-if=\"!notext && !actions[0].noText\">{{actions[0].labelFunction() || actions[0].label | translate}}</span> <i ng-show=\"model.actionInProgress === 'updating'\" ng-cloak class=\"fa fa-circle-o-notch fa-spin\"></i></button> <button ng-disabled=\"actions.length < 2 || model.actionInProgress\" type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"caret\"></span> <span class=\"sr-only\" translate>Weitere Aktionen</span></button><ul ng-if=\"actions.length > 1\" class=\"dropdown-menu\"><li ng-if=\"!$first\" ng-repeat=\"action in actions\" ng-class=\"{disabled: action.isDisabled()}\"><a href=\"\" ng-click=\"!action.isDisabled() && execute(action)\"><i class=\"{{ action.iconClass ? action.iconClass : 'fa fa-floppy-o'}}\"></i> <span ng-if=\"!notext && !actions.noText && !action.noEntityText\">{{entity | translate}}</span> <span ng-if=\"!notext && !action.noText\">{{action.label | translate}}</span></a></li></ul></div></span>"
  );


  $templateCache.put('scripts/common/components/oo-arbeitskategorien.directive.html',
    "<div class=\"btn-group\" data-toggle=\"buttons\"><label ng-repeat=\"arbeitskategorie in arbeitskategorienList\" class=\"btn btn-primary btn-sm\">{{arbeitskategorie}} <i ng-if=\"arbeitskategorienList.length > 1\" class=\"fa fa-times\" ng-click=\"removeArbeitskategorie(arbeitskategorie)\"></i></label><div class=\"btn-group\" role=\"group\"><button ng-show=\"arbeitskategorien.length > 0\" class=\"btn btn-default btn-sm dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"><span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><li ng-repeat=\"arbeitskategorie in arbeitskategorien\"><a href=\"\" ng-click=\"addArbeitskategorie(arbeitskategorie)\">{{arbeitskategorie}}</a></li></ul></div></div>"
  );


  $templateCache.put('scripts/common/components/oo-deletebutton.directive.html',
    "<span><button type=\"button\" ng-click=\"delete()\" ng-disabled=\"model.actionInProgress\" class=\"btn\" ng-class=\"[{'btn-sm':small}, getButtonTypeClass()]\"><i class=\"fa fa-times\"></i> <span ng-if=\"!notext\">Löschen</span> <i ng-show=\"model.actionInProgress === 'deleting'\" class=\"fa fa-circle-o-notch fa-spin\" ng-cloak></i></button></span>"
  );


  $templateCache.put('scripts/common/components/oo-deletebutton.directive.modal.html',
    "<div class=\"modal-header\"><h3 translate>Sind Sie sicher?</h3></div>'<div class=\"modal-body\"><div><span ng-if=\"message\">{{message()}}</span> <span ng-if=\"!message\" translate>Soll der Löschvorgang fortgesetzt werden?</span></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-danger\" ng-show=\"true\" ng-click=\"ok()\" translate>Löschen</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"cancel()\" translate>Abbrechen</button></div>"
  );


  $templateCache.put('scripts/common/components/oo-dialogokabort.directive.modal.html',
    "<div class=\"modal-header\"><h3 translate>Bestätigung</h3></div>'<div class=\"modal-body\"><div><span ng-if=\"message\">{{message}}</span> <span ng-if=\"!message\" translate>Wollen Sie fortfahren?</span></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-danger\" ng-show=\"true\" ng-click=\"ok()\" translate>Ok</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"cancel()\" translate>Abbrechen</button></div>"
  );


  $templateCache.put('scripts/common/components/oo-dropdown.directive.html',
    "<span><div ng-if=\"label\" class=\"navbar-header navbar-brand\">{{label}}</div><ul ng-if=\"displayStyle === 'navbar'\" class=\"nav navbar-nav\"><li uib-dropdown class=\"uib-dropdown\"><a href=\"#\" uib-dropdown-toggle class=\"uib-dropdown-toggle\" data-toggle=\"uib-dropdown\" data-target=\"#\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" ng-disabled=\"disabled\"><span ng-if=\"!isPlaceholder\">{{display|translate}}</span> <span class=\"placeholder\" ng-if=\"isPlaceholder\">{{placeholder|translate}}</span> <span class=\"caret\"></span></a><ul class=\"dropdown-menu\" role=\"menu\" area-labeled-by=\"{{dropdownId}}\"><li ng-repeat=\"item in values\" role=\"menuitem\"><a href=\"\" ng-click=\"select(item)\">{{getDisplayedText(item)|translate}}</a></li></ul></li></ul><div ng-if=\"displayStyle === 'uib-dropdown'\" uib-dropdown><button type=\"button\" uib-dropdown-toggle class=\"btn btn-default uib-dropdown-toggle\" ng-class=\"getClass()\" data-toggle=\"uib-dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" ng-disabled=\"disabled\"><span ng-if=\"!isPlaceholder\">{{display|translate}}</span> <span class=\"placeholder\" ng-if=\"isPlaceholder\">{{placeholder|translate}}</span> <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\" area-labeled-by=\"{{dropdownId}}\"><li ng-repeat=\"item in values\" role=\"menuitem\"><a href=\"\" ng-click=\"select(item)\">{{getDisplayedText(item)|translate}}</a></li></ul></div></span>"
  );


  $templateCache.put('scripts/common/components/oo-erroroverlay.directive.html',
    "<span class=\"error-overlay\" ng-cloak ng-show=\"!!alerts\"><div uib-alert class=\"alert alert-{{(alert.type === 'error' || alert.type === 'lighterror' ) ? 'danger' : alert.type}} alert-dismissible\" ng-repeat=\"alert in alerts\" type=\"{{ alert.type }}\" close=\"$removeAlert($index)\"><span>{{ alert.msg }}<ul ng-if=\"alert.details\"><li ng-repeat=\"detail in alert.details\">{{ detail }}</li></ul></span></div></span>"
  );


  $templateCache.put('scripts/common/components/oo-generate-report.directive.html',
    "<div class=\"panel panel-default\"><div class=\"panel-heading clearfix\"><h3 class=\"panel-title\"><i class=\"fa fa-print\" aria-hidden=\"true\"></i> <span translate>Bericht erstellen</span> <span class=\"pull-right\" ng-show=\"generating\"><i class=\"fa fa-circle-o-notch fa-spin fa-lg\"></i></span></h3></div><div class=\"panel-body\"><form name=\"berichtForm\"><div class=\"row form-group\" ng-show=\"error\"><div class=\"col-md-12\"><div class=\"alert alert-danger\">{{error}}</div></div></div><div class=\"row form-group\"><div class=\"col-md-12\"><label for=\"vorlage\" translate>Vorlage</label></div><div class=\"col-md-12\"><div class=\"btn-group\" uib-dropdown><button id=\"split-button\" type=\"button\" class=\"btn btn-primary\"><span ng-hide=\"form.vorlage || projektVorlage || form.datenExtrakt\" translate>Standardvorlage</span> <span ng-show=\"form.datenExtrakt\" translate>Datenextrakt</span> <span ng-show=\"form.vorlage\" translate>{{form.vorlage.name}}</span> <span ng-show=\"projektVorlage\" translate>{{projektVorlage.name}}</span></button> <button type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle><span class=\"caret\"></span> <span class=\"sr-only\"></span></button><ul class=\"dropdown-menu\" uib-dropdown-menu role=\"menu\" aria-labelledby=\"split-button\"><li role=\"menuitem\"><a ng-click=\"selectStandardVorlage()\" translate>Standardvorlage</a></li><li role=\"menuitem\" ng-repeat=\"vorlage in projektVorlagen\" ng-if=\"vorlage.fileStoreId\"><a ng-click=\"selectProjektVorlage(vorlage)\" translate>{{vorlage.name}}</a></li><li class=\"divider\"></li><li role=\"menuitem\"><a ng-model=\"form.vorlage\" name=\"vorlageFile\" ngf-accept=\"'.odt'\" ngf-max-size=\"10MB\" ngf-select=\"selectFile($file)\" ngf-drop=\"selectFile($file)\" translate>Benutzerdefiniert...</a></li><li class=\"divider\"></li><li role=\"menuitem\"><a ng-click=\"selectDatenExtrakt()\" translate>Datenextrakt</a></li></ul></div></div></div><div class=\"row form-group\" ng-hide=\"form.datenExtrakt\"><div class=\"col-md-5\"><label for=\"pdfGenerieren\" translate>PDF Erstellen</label></div><div class=\"col-md-7\"><input bs-switch ng-model=\"form.pdfGenerieren\" type=\"checkbox\" switch-size=\"medium\" switch-animate=\"true\" switch-on-text=\"{{'Ja'|translate}}\" switch-off-text=\"{{'Nein'|translate}}\" switch-on-color=\"success\" switch-off-color=\"danger\" switch-radio-off=\"false\" ng-true-value=\"true\" ng-false-value=\"false\"></div></div><div class=\"row form-group\" ng-show=\"!form.datenExtrakt && form.pdfGenerieren\"><div class=\"col-md-5\"><label for=\"pdfAblegen\" translate>PDF Ablegen</label></div><div class=\"col-md-7\"><input bs-switch ng-model=\"form.pdfAblegen\" type=\"checkbox\" switch-size=\"medium\" switch-animate=\"true\" switch-on-text=\"{{'Ja'|translate}}\" switch-off-text=\"{{'Nein'|translate}}\" switch-on-color=\"success\" switch-off-color=\"danger\" switch-radio-off=\"false\" ng-true-value=\"true\" ng-false-value=\"false\"></div></div><div class=\"row form-group\" ng-show=\"!form.datenExtrakt && form.pdfAblegen\"><div class=\"col-md-5\"><label for=\"pdfDownload\" translate>Herunterladen</label></div><div class=\"col-md-7\"><input bs-switch ng-model=\"form.pdfDownloaden\" type=\"checkbox\" switch-size=\"medium\" switch-animate=\"true\" switch-on-text=\"{{'Ja'|translate}}\" switch-off-text=\"{{'Nein'|translate}}\" switch-on-color=\"success\" switch-off-color=\"danger\" switch-radio-off=\"false\" ng-true-value=\"true\" ng-false-value=\"false\"></div></div><div class=\"row form-group\"><div class=\"col-md-12\"><span class=\"pull-right\"><a href=\"\" role=\"button\" ng-disabled=\"berichtForm.$invalid || generating\" ng-click=\"generate()\" class=\"btn btn-primary\"><i class=\"fa fa-share-square-o\" aria-hidden=\"true\"></i> <span translate>Erstellen</span></a> <a href=\"\" role=\"button\" ng-disabled=\"generating\" ng-click=\"onClose()()\" class=\"btn btn-danger\"><i class=\"fa fa-times\"></i> <span translate>Abbrechen</span></a></span></div></div></form></div></div>"
  );


  $templateCache.put('scripts/common/components/oo-kundentypen.directive.html',
    "<div class=\"btn-group\" data-toggle=\"buttons\"><label ng-repeat=\"kundentyp in kundentypenList\" class=\"btn btn-primary btn-sm\">{{kundentyp}} <i ng-if=\"kundentypenList.length > 1\" class=\"fa fa-times\" ng-click=\"removeKundentyp(kundentyp)\"></i></label><div class=\"btn-group\" role=\"group\"><button ng-show=\"kundentypen.length > 0\" class=\"btn btn-default btn-sm dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"><span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><li ng-repeat=\"kundentyp in kundentypen\"><a href=\"\" ng-click=\"addKundentyp(kundentyp)\">{{kundentyp}}</a></li></ul></div></div>"
  );


  $templateCache.put('scripts/common/components/oo-liefertage.directive.html',
    "<div class=\"btn-group\" role=\"group\" data-toggle=\"buttons\"><label ng-repeat=\"lt in liefertage\" class=\"btn btn-xs btn-default\" ng-click=\"selectedLiefertag(lt)\" ng-class=\"isSelected(lt)\">{{lt.shortLabel}}</label></div>"
  );


  $templateCache.put('scripts/common/components/oo-savebutton.directive.html',
    "<span><button ng-click=\"save()\" ng-disabled=\"form.$invalid || model.actionInProgress\" class=\"btn btn-primary\" ng-class=\"{'btn-sm':small}\"><i class=\"fa fa-floppy-o\"></i> <span ng-transclude></span> <span ng-if=\"!notext && isNew()\" translate>erstellen</span> <span ng-if=\"!notext && !isNew()\" translate>speichern</span> <i ng-show=\"model.actionInProgress === 'updating'\" ng-cloak class=\"fa fa-circle-o-notch fa-spin\"></i></button><!--button ng-click=\"cancel()\" ng-disabled=\"model.actionInProgress\" class=\"btn btn-default\" translate>Abbrechen</button--></span>"
  );


  $templateCache.put('scripts/common/ngtable/oo-ngtable-noPaginationTemplate.html',
    "<span>"
  );


  $templateCache.put('scripts/common/ngtable/oo-ngtable-paginationTemplate.html',
    "<div class=\"ng-cloak ng-table-pager\" ng-if=\"params.data.length\"><div ng-controller=\"NgTableCountController\" ng-if=\"params.settings().counts.length\" class=\"ng-table-counts btn-group pull-right\"><button ng-repeat=\"cnt in params.settings().counts\" type=\"button\" ng-show=\"cnt <= params.settings().total\" ng-class=\"{'active':params.count() == cnt}\" ng-click=\"count(cnt)\" class=\"btn btn-default\"><span ng-bind=\"cnt\"></span></button> <button type=\"button\" ng-class=\"{'active':params.count() >= params.settings().total}\" ng-click=\"count(5000)\" class=\"btn btn-default\"><span translate>Alle</span> <span>({{params.settings().total}})</span></button></div><div ng-controller=\"NgTableExportController\" class=\"ng-table-export\"><button ng-click=\"exportData()\" ng-show=\"showExport\" class=\"btn btn-default\"><span class=\"fa fa-table\"></span></button></div><ul ng-if=\"pages.length\" class=\"pagination ng-table-pagination\"><li ng-class=\"{'disabled': !page.active && !page.current, 'active': page.current}\" ng-repeat=\"page in pages\" ng-switch=\"page.type\"><a ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">&laquo;</a> <a ng-switch-when=\"first\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a> <a ng-switch-when=\"page\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a> <a ng-switch-when=\"more\" ng-click=\"params.page(page.number)\" href=\"\">&#8230;</a> <a ng-switch-when=\"last\" ng-click=\"params.page(page.number)\" href=\"\"><span ng-bind=\"page.number\"></span></a> <a ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">&raquo;</a></li></ul></div>"
  );


  $templateCache.put('scripts/login/change_password.html',
    "<div class=\"row\"><div oo-error-overlay></div><div class=\"container\"><div class=\"jumbotron\"><h3 translate>Eigenes Passwort wechseln</h3><p></p><div class=\"container\" ng-show=\"status === 'login'\"><div class=\"alert alert-danger\" role=\"alert\" ng-if=\"changePwd.message\">{{changePwd.message}}</div><form class=\"form-signin\" name=\"changePwdForm\"><div class=\"form-group\"><input type=\"password\" name=\"oldPassword\" class=\"form-control\" placeholder=\"{{'Aktuelles Passwort' | translate}}\" required ng-model=\"changePwd.alt\"><div ng-show=\"changePwdForm.oldPassword.$dirty && changePwdForm.oldPassword.$invalid\" ng-messages=\"changePwdForm.oldPassword.$error\"><div ng-messages-include=\"messages.html\"></div></div></div><div class=\"form-group\"><input type=\"password\" name=\"newPassword\" class=\"form-control\" placeholder=\"{{'Neues Passwort' | translate}}\" required ng-model=\"changePwd.neu\" ng-minlength=\"6\" ng-maxlength=\"50\" ng-pattern=\"/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/\"><div ng-show=\"changePwdForm.newPassword.$dirty && changePwdForm.newPassword.$invalid\" ng-messages=\"changePwdForm.newPassword.$error\"><div class=\"messages\"><div ng-message=\"required\" translate>Eingabe erforderlich</div><div ng-message=\"minlength\" translate>Das Passwort muss aus mindestens 6 Zeichen bestehen</div><div ng-message=\"pattern\" translate>Das Passwort muss mindestens einen Gross- und Kleinbuchstaben, sowie einen numerischen Wert oder ein Symbol enthalten</div><div ng-message=\"ooCompareTo\" translate>Passworteingabe stimmt nicht übereint</div></div></div></div><div class=\"form-group\"><label for=\"passwortStrength\" translate>Passwortstärke</label><div ng-password-strength=\"changePwd.neu\" css-mode=\"bootstrap\" strength=\"passStrength\" inner-class=\"progress-bar\" inner-class-prefix=\"progress-bar-\"></div></div><div class=\"form-group\"><input type=\"password\" class=\"form-control\" name=\"confirmPassword\" placeholder=\"{{'Passwort wiederholen' | translate}}\" required ng-model=\"changePwd.neuConfirmed\" oo-compare-to=\"changePwd.neu\"><div ng-show=\"changePwdForm.confirmPassword.$dirty && changePwdForm.confirmPassword.$invalid\" ng-messages=\"changePwdForm.confirmPassword.$error\"><div class=\"messages\"><div ng-message=\"required\" translate>Eingabe erforderlich</div><div ng-message=\"ooCompareTo\" translate>Passworteingabe stimmt nicht übereint</div></div></div></div><div class=\"form-group\"><button ng-disabled=\"changePwdForm.$invalid || env === 'test'\" class=\"btn btn-lg btn-primary\" type=\"submit\" ng-click=\"changePassword()\" translate>Passwort wechseln</button></div></form></div><p></p></div></div></div>"
  );


  $templateCache.put('scripts/login/forbidden.html',
    "<div class=\"row\"><div oo-error-overlay></div><div class=\"container\"><div class=\"alert alert-danger\"><h1 translate>Zugriff verweigert</h1><p translate>Der Zugriff auf diese Ressource wurde verweigert.</p></div></div></div>"
  );


  $templateCache.put('scripts/login/login.html',
    "<div class=\"row\"><div oo-error-overlay></div><div class=\"container\"><div class=\"jumbotron\"><h1><span translate>Anmeldung</span> <small ng-if=\"env === 'test'\" translate>- Testumgebung</small> <small ng-if=\"env === 'dev'\" class=\"\" translate>- Entwicklungsumgebung</small></h1><span ng-if=\"appName === 'openolitor-admin'\"><p translate>Für den Zugriff auf die Administrationsumgebung ist eine Anmeldung erforderlich</p><div class=\"alert alert-info\" ng-if=\"env === 'test' || env === 'dev'\"><span translate>Sie befinden sich auf dem OpenOlitor Testsystem. Sie können sich mit den untenstehenden Anmeldeinformationen an der Administrationsumgebung anmelden:</span><br><br><ul><li><span translate>E-Mail:</span> <b>admin@openolitor.ch</b></li><li><span translate>Passwort:</span> <b>admin</b></li></ul><br><span translate>Die Daten in diesem System werden sporadisch auf die Standardwerte zurückgesetzt.</span></div></span><span ng-if=\"appName !== 'openolitor-admin'\"><p translate>Für den Zugriff auf OpenOlitor ist eine Anmeldung erforderlich</p><div class=\"alert alert-info\" ng-if=\"env === 'test' || env === 'dev'\"><span translate>Sie befinden sich auf dem OpenOlitor Testsystem. Sie können sich mit den untenstehenden Anmeldeinformationen als Konsument anmelden:</span><br><br><ul><li><span translate>E-Mail:</span> <b>konsument@openolitor.ch</b></li><li><span translate>Passwort:</span> <b>kunde</b></li></ul><br><span translate>Für den Zugang auf die Administrationsumgebung von OpenOlitor, bitte den Link unten rechts verwenden.</span><br><span translate>Die Daten in diesem System werden sporadisch auf die Standardwerte zurückgesetzt.</span></div></span><span ng-show=\"projekt.welcomeMessage1 && (!projekt.maintenanceMode || appName === 'openolitor-admin')\"><div class=\"alert alert-info\"><p>{{projekt.welcomeMessage1}}</p></div></span><span ng-show=\"projekt.maintenanceMode && appName !== 'openolitor-admin'\"><div class=\"alert alert-info\"><p translate>Das Kundenportal ist gegenwärtig nicht verfügbar. Wir führen Unterhaltsarbeiten durch. In Kürze sind wir wieder online und wie gewohnt für Sie da.</p></div></span><span ng-show=\"projekt.maintenanceMode && appName === 'openolitor-admin'\"><div class=\"alert alert-info\"><p translate>Unterhalts-Moduls! Das Kundenportal ist gegenwärtig nicht verfügbar. Bitte sobald wie möglich wieder aktivieren!</p></div></span><span ng-show=\"!projekt.maintenanceMode || appName === 'openolitor-admin'\"><p></p><div class=\"container\" ng-show=\"status === 'login'\"><div class=\"alert alert-danger\" role=\"alert\" ng-if=\"loginData.message\">{{loginData.message}}</div><form class=\"form-signin\" name=\"loginForm\"><div class=\"form-group\"><input type=\"email\" class=\"form-control\" placeholder=\"{{'E-Mail Adresse' | translate}}\" required autofocus ng-model=\"loginData.email\"></div><div class=\"form-group\"><input type=\"password\" class=\"form-control\" placeholder=\"{{'Passwort' | translate}}\" required ng-model=\"loginData.passwort\"></div><div class=\"form-group\"><button ng-disabled=\"loginForm.$invalid\" class=\"btn btn-lg btn-primary\" type=\"submit\" ng-click=\"login()\" translate>Anmelden</button></div><div class=\"form-group\"><a ng-href=\"#/passwordreset\" translate>Passwort vergessen?</a></div></form><div class=\"pull-right\" ng-if=\"appName !== 'openolitor-admin'\"><a class=\"btn btn-xs btn-default\" href=\"/admin/#\" tooltip-placement=\"left\" tooltip-enable=\"(env === 'test' || env === 'dev')\" tooltip-is-open=\"true\" uib-tooltip-html=\"'Für das Testen der Administrationsumgebung, bitte hier klicken!' | translate\" translate>Login Administration</a></div></div><div class=\"container\" ng-show=\"status === 'twoFactor'\"><div class=\"alert alert-info\" role=\"alert\"><span translate>Es wurde ein Zugangscode an ihre Email-Adresse</span> <b>{{person.email}}</b> <span translate>zugestellt.</span></div><div class=\"alert alert-danger\" role=\"alert\" ng-if=\"secondFactorForm.message\">{{secondFactorForm.message}}</div><form class=\"form-signin\" name=\"secondFactorForm\"><div class=\"form-group\"><input type=\"text\" class=\"form-control\" placeholder=\"{{'Zugangscode' | translate}} - {{secondFactorCountdownDate() | fromNow}} {{'läuft dieser Loginversuch ab'}}\" required autofocus ng-model=\"secondFactorData.code\"></div><div class=\"form-group\"><button ng-disabled=\"secondFactorForm.$invalid\" class=\"btn btn-lg btn-primary\" type=\"submit\" ng-click=\"secondFactorLogin()\" translate>Anmelden</button></div><div class=\"form-group\"><a ng-href=\"#/login\" ng-click=\"resetForm()\" translate>Zugangscode erneut versenden</a></div></form></div><p></p></span></div></div></div>"
  );


  $templateCache.put('scripts/login/logout.html',
    "<div class=\"row\"><div class=\"content content-box col-md-9\"><div oo-error-overlay></div></div></div>"
  );


  $templateCache.put('scripts/login/passwordreset.html',
    "<div class=\"row\"><div oo-error-overlay></div><div class=\"container\"><div class=\"jumbotron\"><h3 translate>Passwort vergessen?</h3><div class=\"alert alert-info\" translate>Wenn Sie ihr Passwort vergessen haben, können Sie sich einen Reset-Link senden lassen.</div><p></p><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\" ng-if=\"resetPasswordData.message\">{{resetPasswordData.message}}</div><form class=\"form-signin\" name=\"resetPasswordForm\"><div class=\"form-group\"><input type=\"email\" class=\"form-control\" placeholder=\"{{'Email Adresse' | translate}}\" required autofocus ng-model=\"resetPasswordData.email\"></div><div class=\"form-group\"><button ng-disabled=\"resetPasswordForm.$invalid\" class=\"btn btn-lg btn-primary\" type=\"submit\" ng-click=\"resetPassword()\" translate>Passwort zurücksetzen</button></div></form></div><p></p></div></div></div>"
  );


  $templateCache.put('scripts/login/zugangaktivieren.html',
    "<div class=\"row\"><div oo-error-overlay></div><div class=\"container\"><div class=\"jumbotron\"><h3 translate>Passwort setzen und Zugang aktivieren</h3><p></p><div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\" ng-if=\"initPassword.message\">{{initPassword.message}}</div><form class=\"form-signin\" name=\"setPasswordForm\"><div class=\"form-group\"><input type=\"password\" name=\"newPassword\" class=\"form-control\" placeholder=\"{{'Passwort' | translate}}\" required ng-model=\"initPassword.neu\" ng-minlength=\"6\" ng-maxlength=\"50\" ng-pattern=\"/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/\"><div ng-show=\"setPasswordForm.newPassword.$dirty && setPasswordForm.newPassword.$invalid\" ng-messages=\"setPasswordForm.newPassword.$error\"><div class=\"messages\"><div ng-message=\"required\" translate>Eingabe erforderlich</div><div ng-message=\"minlength\" translate>Das Passwort muss aus mindestens 6 Zeichen bestehen</div><div ng-message=\"pattern\" translate>Das Passwort muss mindestens einen Gross- und Kleinbuchstaben, sowie einen numerischen Wert oder ein Symbol enthalten</div><div ng-message=\"ooCompareTo\" translate>Passworteingabe stimmt nicht übereint</div></div></div></div><div class=\"form-group\"><label for=\"passwortStrength\" translate>Passwortstärke</label><div ng-password-strength=\"initPassword.neu\" css-mode=\"bootstrap\" strength=\"passStrength\" inner-class=\"progress-bar\" inner-class-prefix=\"progress-bar-\"></div></div><div class=\"form-group\"><input type=\"password\" class=\"form-control\" name=\"confirmPassword\" placeholder=\"{{'Passwort wiederholen' | translate}}\" required ng-model=\"initPassword.neuConfirmed\" oo-compare-to=\"initPassword.neu\"><div ng-show=\"setPasswordForm.confirmPassword.$dirty && setPasswordForm.confirmPassword.$invalid\" ng-messages=\"setPasswordForm.confirmPassword.$error\"><div class=\"messages\"><div ng-message=\"required\" translate>Eingabe erforderlich</div><div ng-message=\"ooCompareTo\" translate>Passworteingabe stimmt nicht übereint</div></div></div></div><div class=\"form-group\"><button ng-disabled=\"setPasswordForm.$invalid || env === 'test'\" class=\"btn btn-lg btn-primary\" type=\"submit\" ng-click=\"setPassword()\" translate>Passwort setzen</button></div></form></div><p></p></div></div></div>"
  );


  $templateCache.put('scripts/not-found.html',
    "<div class=\"row\"><div class=\"content content-box col-md-9\"><div oo-error-overlay></div><div class=\"panel panel-default\"><div class=\"panel-heading clearfix\"><h3 class=\"panel-title\"><span class=\"navbar-brand\" translate>Error 404</span></h3></div><div class=\"panel-body\"><span translate>Diese Seite konnte nicht gefunden werden!</span></div></div></div></div>"
  );

}]);
