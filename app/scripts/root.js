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
        if (lang.startsWith('de-CH')) {
          $scope.changeLang('de_CH');
        } else if (lang.startsWith('de-DE')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('de')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('fr-BE')) {
          $scope.changeLang('fr_BE');
        } else if (lang.startsWith('fr-CH')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('fr')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('en')) {
          $scope.changeLang('en');
        } else if (lang.startsWith('es')) {
          $scope.changeLang('es');
        } else if (lang.startsWith('cs')) {
          $scope.changeLang('cs');
        } else if (lang.startsWith('hu')) {
          $scope.changeLang('hu');
        } else {
          $scope.changeLang('en');
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
